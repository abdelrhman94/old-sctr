'use client'
import { DataTable } from '@/components/shared/DataTable';
import { useDisclosure } from '@/hooks/useDisclosure';
import { RequestsResponse } from '@/models/Requests.model';
import { useAssignRequestReviewerMutation, useGetRequestsQuery, useLazyGetReviewersQuery } from '@/store/api/requestsApi';
import { format } from 'date-fns';
import { useLocale, useTranslations } from 'next-intl';
import { createParser, parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useMemo, useState } from 'react';
import { createRequestColumns } from './_components/Columns';
import RequestsFilters from './_components/RequestsFilters';
import { useRouter } from '@/i18n/navigation';
import { useAssignReviewerMutation } from '@/store/api/usersApi';
import { FormDialog } from '@/components/shared/FormDialog';
import { AsyncPaginateSelect } from '@/components/shared/AsyncSelect';
import toast from 'react-hot-toast';

const RequestsPage = () => {
  const t = useTranslations('RequestsPage');
  const locale = useLocale()
  const router = useRouter();

  const parseAsDayMonthYear = createParser<Date | null>({
    parse: (value) => {
      if (!value) return null;
      const [dd, mm, yyyy] = value.split("-");
      const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      return isNaN(d.getTime()) ? null : d;
    },
    serialize: (value) => (value ? format(value, "dd-MM-yyyy") : ""),
  });


  const [{ date, requestStatus, page, pageSize, search }, setQuery] = useQueryStates({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    date: parseAsDayMonthYear.withDefault(null).withOptions({ clearOnDefault: true }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    requestStatus: parseAsInteger.withDefault(null).withOptions({ clearOnDefault: true }),
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),

    // pagination in URL too (optional, but handy)
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
  });

  // Controlled server-side pagination
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const apiPageNumber = pagination.pageIndex + 1


  const { data: RequestsList, isFetching } = useGetRequestsQuery({
    date: date ? date.toISOString() : "",
    language: locale,
    pageNumber: apiPageNumber,
    pageSize: pageSize,
    search: search ?? "",
    studyStatus: requestStatus ?? undefined,
  })

  const totalRows = RequestsList?.totalRowsCount ?? 0;
  const pageCount = RequestsList?.numberOfPages ?? Math.max(1, Math.ceil(totalRows / Math.max(pageSize, 1)));

  const [assignRequestReviewer, { isLoading: isAssigning }] = useAssignRequestReviewerMutation()

 const [triggerReviewers] = useLazyGetReviewersQuery();

  const [selectedReviewer, setSelectedReviewer] = useState(null);

  const loadReviewersOptions = useMemo(
    () =>
      async (search: string, page: number) => {
        const res = await triggerReviewers({
          pageNumber: page,
          pageSize: 10,
          parentId: 1,
          search,
        }).unwrap();

        return {
          data: res.data.map((r) => ({
            label: r.nameEn ?? r.nameAr ?? `#${r.id}`,
            value: r.id,
            nameEn: r.nameEn,
            nameAr: r.nameAr,
          })),
          currentPage: res.currentPage,
          numberOfPages: res.numberOfPages,
        };
      },
    [triggerReviewers]
  );
  
  const [assignTarget, setAssignTarget] = useState<RequestsResponse | null>(null);
  const assignDlg = useDisclosure(false);

  const columns = useMemo(
    () =>
      createRequestColumns({
        onAssignReviewer: (request) => {
          setAssignTarget(request);
          assignDlg.onOpen();
        },
        onView: (request) => router.push(`/requests/${request.studyId}`),

      }),
    [assignDlg, router]
  );

  return (
    <section className='p-4'>
      <h2 className='text-[#202020] font-semibold text-3xl my-1'>{t('title')}</h2>
      <div className="container mx-auto py-10">
        <RequestsFilters
          date={date}
          requestStatus={requestStatus}
          setQuery={setQuery}
          onChanged={() => setQuery({ page: 1 })}
        />
        <DataTable
          columns={columns}
          data={RequestsList?.data ?? []}
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
        <FormDialog
              open={assignDlg.open}
              onOpenChange={(o) => (!o ? assignDlg.onClose() : assignDlg.onOpen())}
              title="Assign Reviewer"
              description={
                <>
                  Assign a reviewer to <strong>{assignTarget?.studyName}</strong>.
                </>
              }
              submitLabel="Assign"
              isSubmitting={isAssigning}
              onSubmit={async () => {
                if (!assignTarget || !selectedReviewer) {
                  toast.error("Choose a reviewer");
                  return;
                }
                try {
                  await assignRequestReviewer({
                    studyId: assignTarget.studyId,
                    reviewerUserId: selectedReviewer,
                  }).unwrap();
                  toast.success("Reviewer assigned");
                  assignDlg.onClose();
                  setAssignTarget(null);
                  setSelectedReviewer(null);
                } catch (e: any) {
                  toast.error(e?.data?.message ?? "Failed to assign reviewer");
                }
              }}
            >
      
      
              <div className="space-y-2">
                <AsyncPaginateSelect
                  label="Reviewers"
                  value={selectedReviewer}
                  onChange={(opt: any) => {
                    setSelectedReviewer(opt)
                  }}
                  valueType="string"
                  placeholder="Search Reviewers..."
                  loadPage={loadReviewersOptions}
                  defaultOptions
                  cacheUniqs={[assignDlg.open]}
                />
              </div>
            </FormDialog>
    </section>
  )
}

export default RequestsPage