import { BaseInput } from "@/components/shared/BaseInput";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import ResponseStatusComponent from "@/components/shared/ResponseStatusComponent";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/enums/enums";
import { useRoleAuth } from "@/hooks/useAuthorization";
import { useDisclosure } from "@/hooks/useDisclosure";
import { SaveIPDRequest } from "@/models/Studies.model";
import { useManagerDecisionMutation, useOrgMangerDecisionMutation, useReviewerDecisionMutation } from "@/store/api/requestsApi";
import { useLazyGetIPDQuery } from "@/store/api/studiesApi";
import { prevReviewStudyStep } from "@/store/slices/reviewStudyStepsSlice";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

type Props = {
  totalSteps: number;
  studyId: string;
  navigationDirection: "forward" | "back" | "initial";
  setNavigationDirection: (state: "forward" | "back" | "initial") => void;
};

const ReviewSharingStatement = ({ navigationDirection, studyId, setNavigationDirection }: Props) => {
  const dispatch = useDispatch();
  const [summaryData, setSummaryData] = useState<SaveIPDRequest>();
  const [getIPD, { isFetching }] = useLazyGetIPDQuery();

  // NEW: decision state -> controls success screens
  const [decision, setDecision] = useState<"idle" | "approved" | "rejected">("idle");

  const GetIPD = async () => {
    try {
      const response = await getIPD(studyId).unwrap();
      setSummaryData(response.data);
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ??
        (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const onBack = () => {
    setNavigationDirection("back");
    dispatch(prevReviewStudyStep());
  };

  useEffect(() => {
    if (navigationDirection === "back" || navigationDirection === "forward") {
      GetIPD();
    }
  }, [navigationDirection]);

  const { hasRole } = useRoleAuth();
  const acceptDlg = useDisclosure(false);
  const rejectDlg = useDisclosure(false);

  const [orgMangerDecision, { isLoading: isLoadingOrgMangerDecision }] = useOrgMangerDecisionMutation();
  const [reviewerDecision, { isLoading: isLoadingReviewerDecision }] = useReviewerDecisionMutation();
  const [managerDecision, { isLoading: isLoadingManagerDecision }] = useManagerDecisionMutation();

  const isAnyLoading = isLoadingOrgMangerDecision || isLoadingReviewerDecision || isLoadingManagerDecision;

  // NEW: single action helper
  const act = async (isApproved: boolean, comment?: string) => {
    try {
      let response;
      if (hasRole(UserRole.ORGANIZATION_ADMIN)) {
        response = await orgMangerDecision({ isApproved, studyId, comment: comment ?? "" }).unwrap();
      } else if (hasRole(UserRole.REVIEWER)) {
        response = await reviewerDecision({ isApproved, studyId, comment: comment ?? "" }).unwrap();
      } else if (hasRole(UserRole.DIRECTOR_MANAGER)) {
        response = await managerDecision({ isApproved, studyId, comment: comment ?? "" }).unwrap();
      } else {
        throw new Error("Unsupported role");
      }
      toast.success(response?.message);
      if (isApproved) {
        setDecision("approved");
        acceptDlg.onClose();
      } else {
        setDecision("rejected");
        rejectDlg.onClose();
      }
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ??
        (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }

  };

  const handleApproved = (comment: any) => act(true, comment);
  const handleReject = (comment: any) => act(false, comment);

  // NEW: render success/reject screen exclusively
  if (decision === "approved") {
    return (
      <ResponseStatusComponent
        btnName="Done"
        routeLink="/requests"
        status="success"
        title="Review submitted successfully"
        description="Study has been approved. It will proceed to the next step."
      />
    );
  }
  if (decision === "rejected") {
    return (
      <ResponseStatusComponent
        btnName="Done"
        routeLink="/requests"
        status="reject"
        title="Review submitted successfully"
        description="Study has been rejected. It will be returned to the requester."
      />
    );
  }

  // Default screen (no decision yet)
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="collaborations"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.3 }}
        className=""
      >
        <div className="relative  flex items-center justify-center">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="link"
              onClick={onBack}
              disabled={isFetching || isAnyLoading}
              className="absolute -left-45 -top-10 !p-0 flex items-center gap-0.5 !no-underline"
            >
              <ChevronLeft />
              Back
            </Button>
          </div>
          <h2 className="text-secondary font-medium text-3xl my-1 text-center md:text-left">
            IPD sharing statement
          </h2>
        </div>

        {isFetching ? (
          <div className="flex justify-center items-center h-[400px]">
            <Loader2 size={100} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-col min-h-[400px]">
            <div className="flex-grow space-y-8 my-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <BaseInput
                  disabled
                  label="Plan to share individual participants data (IPD)"
                  type="text"
                    value={summaryData?.isIndividualParticipantsDataShared === 1 ? "Yes" : "No Plan to share"}
                />
              </div>
                {summaryData?.isIndividualParticipantsDataShared === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <BaseInput
                      disabled
                      label="IPD sharing plan description"
                      type="text"
                      value={summaryData?.ipdSharingPlanDescription}
                    />
                    <BaseInput disabled label="Website" type="text" value={summaryData?.trialWebsite} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <BaseInput
                      disabled
                      label="Is the individual participants data shared?"
                      type="text"
                      value={summaryData?.isIndividualParticipantsDataShared ? "Yes" : "No"}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-auto pt-6 flex justify-between">
              <Button
                type="button"
                className="w-1/3 py-6"
                disabled={isAnyLoading}
                isLoading={isAnyLoading}
                variant="destructive"
                onClick={rejectDlg.onOpen}
              >
                Reject
              </Button>
              <Button
                type="button"
                className="w-1/3 py-6"
                disabled={isAnyLoading}
                isLoading={isAnyLoading}
                onClick={acceptDlg.onOpen}
              >
                Approve
              </Button>
            </div>
          </div>
        )}

        {/* Approve dialog */}
        <ConfirmDialog
          open={acceptDlg.open}
          onOpenChange={(o) => (!o ? acceptDlg.onClose() : acceptDlg.onOpen())}
          title="Approve Study"
          description={<>Are you sure you want to Approve?</>}
          confirmLabel="Approve"
          cancelLabel="Cancel"
          confirmClassName="bg-green-600 hover:bg-green-700"
          isLoading={isAnyLoading}
          textareaProps={{
            label: "Notes",
            placeholder: "",
            required: false,
            maxLength: 500,
            rows: 5,
          }}
          onConfirm={handleApproved}
        />

        {/* Reject dialog */}
        <ConfirmDialog
          open={rejectDlg.open}
          onOpenChange={(o) => (!o ? rejectDlg.onClose() : rejectDlg.onOpen())}
          title="Reject Study"
          description={<>Are you sure you want to Reject?</>}
          confirmLabel="Reject"
          cancelLabel="Cancel"
          confirmClassName="bg-red-600 hover:bg-red-700"
          isLoading={isAnyLoading}
          textareaProps={{
            label: "Notes*",
            placeholder: "",
            required: true,
            maxLength: 500,
            rows: 5,
          }}
          onConfirm={handleReject}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewSharingStatement;
