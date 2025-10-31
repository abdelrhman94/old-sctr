'use client'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { DataTable } from '@/components/shared/DataTable';
import { Button, buttonVariants } from '@/components/ui/button';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/libs/utils';
import { StudiesResponse } from '@/models/Studies.model';
import { useDeleteStudyMutation, useGetStudiesQuery, useInitiateStudyMutation } from '@/store/api/studiesApi';
import { setCreateStudyStep } from '@/store/slices/createStudyStepsSlice';
import { format } from 'date-fns';
import { FileSearch } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { createParser, parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useMemo, useState } from 'react';
import toast from "react-hot-toast";
import { useDispatch } from 'react-redux';
import { studiesColumns } from './_components/Columns';
import StudiesFilters from './_components/StudiesFilters';





const StudiesPage = () => {
  const t = useTranslations('StudiesPage');
  const locale = useLocale()
  const route = useRouter()
  const dispatch = useDispatch();
  const [initiateStudy, { isLoading }] = useInitiateStudyMutation();


  const parseAsDayMonthYear = createParser<Date | null>({
    parse: (value) => {
      if (!value) return null;
      const [dd, mm, yyyy] = value.split("-");
      const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      return isNaN(d.getTime()) ? null : d;
    },
    serialize: (value) => (value ? format(value, "dd-MM-yyyy") : ""),
  });


  const [{ date, studyType, studyStatus, page, pageSize, search }, setQuery] = useQueryStates({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    date: parseAsDayMonthYear.withDefault(null).withOptions({ clearOnDefault: true }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    studyType: parseAsInteger.withDefault(null).withOptions({ clearOnDefault: true }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    studyStatus: parseAsInteger.withDefault(null).withOptions({ clearOnDefault: true }),
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),

    // pagination in URL too (optional, but handy)
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
  });


  // Controlled server-side pagination
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const apiPageNumber = pagination.pageIndex + 1

  const { data: StudiesList, isFetching } = useGetStudiesQuery({
    date: date ? date.toISOString() : "",
    language: locale,
    pageNumber: apiPageNumber,
    pageSize: pageSize,
    search: search ?? "",
    studyStatus: studyStatus ?? undefined,
    studyType: studyType ?? undefined,
  })

  const totalRows = StudiesList?.totalRowsCount ?? 0;
  const pageCount = StudiesList?.numberOfPages ?? Math.max(1, Math.ceil(totalRows / Math.max(pageSize, 1)));


  const handleCreateStudy = async () => {
    try {
      const response = await initiateStudy({}).unwrap();
      route.push(`/studies/create?id=${response.data.studyId}&recordNumber=${response.data.recordNumber}&registrationNumber=${response.data.sctR_RegistrationNumber}&dateOfRegistration=${response.data.sctR_RegistrationDate}`)
      dispatch(setCreateStudyStep(1))
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";

      toast.error(errorMessage);
    }

  }
  const [deleteStudy, { isLoading: isDeleting }] = useDeleteStudyMutation()

  const deleteDlg = useDisclosure(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const columns = useMemo(
    () =>
      studiesColumns({
        onUpdate: (study) => {
          route.push(`/studies/create?id=${study.studyId}`)
        },
        onDeleteStudy: (study) => {
          setDeleteTarget(study.studyId)
          deleteDlg.onOpen()
        }
      }),
    [route, deleteDlg]
  );



  return (
    <section className='p-4'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-[#202020] font-semibold text-3xl my-1'>{t('title')}</h2>
          <p className='text-[#A5A5A5] text-sm my-1'>{t('description')}</p>
        </div>
        <div className='flex gap-2 items-center'>
          {/* <RoleGuard requiredRoles={[UserRole.ORGANIZATION_ADMIN, UserRole.INDIVIDUAL, UserRole.SUB_USER]}> */}
          <Button className={cn(
            buttonVariants({ variant: "default", }),
            "rounded-full !p-6 "
          )} onClick={handleCreateStudy} isLoading={isLoading}>
            <FileSearch width={26} height={26} />
            {t("add_new_study")}</Button>
          {/* </RoleGuard> */}
        </div>
      </div>



      <div className="container mx-auto py-10">
        <StudiesFilters
          date={date}
          studyType={studyType}
          studyStatus={studyStatus}
          setQuery={setQuery}
          onChanged={() => setQuery({ page: 1 })}
        />
        <DataTable
          columns={columns}
          data={StudiesList?.data ?? []}
          page={{
            pageIndex: apiPageNumber - 1,
            pageSize: pageSize,
            pageCount,
            totalRows,
          }}
          onPageChange={(updater) => {
            setQuery((prev) => {
              const next = typeof updater === "function" ? updater({ pageIndex: apiPageNumber - 1, pageSize }) : updater;
              return { ...prev, page: next.pageIndex + 1 };
            });
          }}
          onPageSizeChange={(size) => setQuery({ pageSize: size, page: 1 })}
          isLoading={isFetching}
        />
      </div>
      <ConfirmDialog
        open={deleteDlg.open}
        onOpenChange={(o) => (!o ? deleteDlg.onClose() : deleteDlg.onOpen())}
        title="Delete study?"
        description={
          <>
            This action cannot be undone. You are about to delete study
          </>
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmClassName="bg-red-600 hover:bg-red-700"
        isLoading={isDeleting}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            const response = await deleteStudy({studyId: deleteTarget}).unwrap();
            toast.success(response?.message);
            deleteDlg.onClose();
            setDeleteTarget(null);
          } catch (error) {
            const errorMessage =
              (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
              "Something went wrong";
            toast.error(errorMessage);
          }
        }}
      />
    </section>
  )
}

export default StudiesPage