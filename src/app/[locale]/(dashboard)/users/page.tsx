'use client'
import { AsyncPaginateSelect } from '@/components/shared/AsyncSelect';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { DataTable } from '@/components/shared/DataTable';
import { FormDialog } from '@/components/shared/FormDialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/libs/utils';
import { UsersResponse } from '@/models/Users.model';
import { useLazyGetReviewersQuery } from '@/store/api/requestsApi';
import { useAssignReviewerMutation, useGetUsersQuery, useProcessApprovalRequestMutation } from '@/store/api/usersApi';
import { format } from 'date-fns';
import { useLocale, useTranslations } from 'next-intl';
import { createParser, parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { createUserColumns } from './_components/Columns';
import UsersFilters from './_components/UsersFilters';

const UsersPage = () => {
  const t = useTranslations('UsersPage');
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



  const [{ date, accountType, userStatus, page, pageSize, search }, setQuery] = useQueryStates({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    date: parseAsDayMonthYear.withDefault(null).withOptions({ clearOnDefault: true }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    accountType: parseAsInteger.withDefault(null).withOptions({ clearOnDefault: true }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    userStatus: parseAsInteger.withDefault(null).withOptions({ clearOnDefault: true }),
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),

    // pagination in URL too (optional, but handy)
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
  });

  // Controlled server-side pagination
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const apiPageNumber = pagination.pageIndex + 1

  const { data: UsersList, isFetching } = useGetUsersQuery({
    date: date ? date.toISOString() : "",
    language: locale,
    pageNumber: apiPageNumber,
    pageSize: pageSize,
    search: search ?? "",
    userType: accountType ?? undefined,
    userStatus: userStatus ?? undefined,
  })

  const totalRows = UsersList?.totalRowsCount ?? 0;
  const pageCount = UsersList?.numberOfPages ?? Math.max(1, Math.ceil(totalRows / Math.max(pageSize, 1)));


  // shared dialog state
  const deleteDlg = useDisclosure(false);
  const acceptDlg = useDisclosure(false);
  const rejectDlg = useDisclosure(false);
  const assignDlg = useDisclosure(false);

  const [deleteTarget, setDeleteTarget] = useState<UsersResponse | null>(null);
  const [acceptTarget, setAcceptTarget] = useState<UsersResponse | null>(null);
  const [rejectTarget, setRejectTarget] = useState<UsersResponse | null>(null);
  const [assignTarget, setAssignTarget] = useState<UsersResponse | null>(null);
  const [selectedReviewer, setSelectedReviewer] = useState(null);

  const [assignReviewer, { isLoading: isAssigning }] = useAssignReviewerMutation()
  const [processApprovalRequest, { isLoading: isProcessing }] = useProcessApprovalRequestMutation()


  const [triggerReviewers] = useLazyGetReviewersQuery();



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





  const columns = useMemo(
    () =>
      createUserColumns({
        onAssignReviewer: (user) => {
          setAssignTarget(user);
          assignDlg.onOpen();
        },
        onDeleteUser: (user) => {
          setDeleteTarget(user);
          deleteDlg.onOpen();
        },
        onAccept: (user) => {
          setAcceptTarget(user);
          acceptDlg.onOpen();
        },
        onReject: (user) => {
          setRejectTarget(user);
          rejectDlg.onOpen();
        },
        onView: (user) => router.push(`/users/${user.id}`),
        onUpdate: (user) => router.push(`/users/${user.id}/edit`),
      }),
    [assignDlg, deleteDlg, acceptDlg, rejectDlg, router]
  );
  
  return (
    <section className='p-4'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-[#202020] font-semibold text-3xl my-1'>{t('title')}</h2>
        </div>
        <div className='flex gap-2 items-center'>
          {/* <Authorized roles={[UserRole.ORGANIZATION_ADMIN, UserRole.DIRECTOR_MANAGER]}>
          <Button className='py-5'>{t("add_sub_user")}</Button>
        </Authorized> */}
          <Button className={cn(
            buttonVariants({ variant: "default", }),
            "rounded-full !p-6 "
          )}
            onClick={() => {
              router.push('/users/create')
            }}
          >

            Create Sub User</Button>
        </div>
      </div>
      <div className="container mx-auto py-10">
        <UsersFilters
          date={date}
          accountType={accountType}
          userStatus={userStatus}
          setQuery={setQuery}
          onChanged={() => setQuery({ page: 1 })}
        />
        <DataTable
          columns={columns}
          data={UsersList?.data ?? []}
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
      {/* Reusable destructive confirm */}
      <ConfirmDialog
        open={deleteDlg.open}
        onOpenChange={(o) => (!o ? deleteDlg.onClose() : deleteDlg.onOpen())}
        title="Delete user?"
        description={
          <>
            This action cannot be undone. You are about to delete{" "}
            <strong>{deleteTarget?.fullName}</strong>.
          </>
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmClassName="bg-red-600 hover:bg-red-700"
        isLoading={false}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            // await deleteUser({ userId: deleteTarget.userId }).unwrap();
            toast.success("User deleted");
            deleteDlg.onClose();
            setDeleteTarget(null);
          } catch (e: any) {
            toast.error(e?.data?.message ?? "Failed to delete user");
          }
        }}
      />

      <ConfirmDialog
        open={acceptDlg.open}
        onOpenChange={(o) => (!o ? acceptDlg.onClose() : acceptDlg.onOpen())}
        title="Accept user?"
        description={
          <>
            This action cannot be undone. You are about to accept{" "}
            <strong>{deleteTarget?.fullName}</strong>.
          </>
        }
        confirmLabel="Accept"
        cancelLabel="Cancel"
        confirmClassName="bg-green-600 hover:bg-green-700"
        isLoading={isProcessing}
        onConfirm={async () => {
          if (!acceptTarget) return;
          try {
            const response = await processApprovalRequest({ approvalRequestId: acceptTarget.id, isApproved: true }).unwrap();
            toast.success(response?.message);
            acceptDlg.onClose();
            setAcceptTarget(null);
          } catch (error) {
            const errorMessage =
              (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
              "Something went wrong";
            toast.error(errorMessage);
          }
        }}
      />

      <ConfirmDialog
        open={rejectDlg.open}
        onOpenChange={(o) => (!o ? rejectDlg.onClose() : rejectDlg.onOpen())}
        title="Reject user?"
        description={
          <>
            This action cannot be undone. You are about to reject{" "}
            <strong>{rejectTarget?.fullName}</strong>.
          </>
        }
        confirmLabel="Reject"
        cancelLabel="Cancel"
        confirmClassName="bg-red-600 hover:bg-red-700"
        isLoading={isProcessing}
        textareaProps={{
          label: "Comments (required)",
          placeholder: "Tell the requester why this is rejected…",
          required: true,
          maxLength: 500,
          rows: 5,
        }}
        onConfirm={async (comment) => {
          if (!rejectTarget) return;
          try {
            const response = await processApprovalRequest({
              approvalRequestId: rejectTarget.id,
              isApproved: false,
              comments: comment ?? "",
            }).unwrap();
            toast.success(response?.message);
            rejectDlg.onClose();
            setRejectTarget(null);
          } catch (error) {
            const errorMessage =
              (error as { data?: { message?: string } })?.data?.message ??
              (error as { message?: string })?.message ??
              "Something went wrong";
            toast.error(errorMessage);
          }
        }}
      />

      {/* Reusable form dialog shell */}
      <FormDialog
        open={assignDlg.open}
        onOpenChange={(o) => (!o ? assignDlg.onClose() : assignDlg.onOpen())}
        title="Assign Reviewer"
        description={
          <>
            Assign a reviewer to <strong>{assignTarget?.fullName}</strong>.
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
            await assignReviewer({
              userId: assignTarget.id,
              assignedUserId: selectedReviewer,
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

export default UsersPage