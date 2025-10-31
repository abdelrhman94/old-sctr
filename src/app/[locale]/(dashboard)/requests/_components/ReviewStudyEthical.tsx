import { BaseInput } from '@/components/shared/BaseInput';
import { Button } from '@/components/ui/button';
import { useRoleAuth } from '@/hooks/useAuthorization';
import { useDisclosure } from '@/hooks/useDisclosure';
import { SaveEthicalApprovalRequest } from '@/models/Studies.model';
import { useManagerDecisionMutation, useOrgMangerDecisionMutation, useReviewerDecisionMutation } from '@/store/api/requestsApi';
import { useLazyGetEthicalApprovalQuery } from '@/store/api/studiesApi';
import { nextReviewStudyStep, prevReviewStudyStep } from '@/store/slices/reviewStudyStepsSlice';
import { formatToDDMMYYYY } from '@/utils/dates';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

type Props = {
  totalSteps: number;
  studyId: string;
  navigationDirection: 'forward' | 'back' | 'initial';
  setNavigationDirection: (state: 'forward' | 'back' | 'initial') => void
}
const ReviewStudyEthical = ({ navigationDirection, studyId, setNavigationDirection }: Props) => {
  const dispatch = useDispatch()
  const [summaryData, setSummaryData] = useState<SaveEthicalApprovalRequest>();
  const [getEthicalApproval, { isFetching }] = useLazyGetEthicalApprovalQuery();

  const GetEthicalApproval = async () => {
    try {
      const response = await getEthicalApproval(studyId).unwrap();
      setSummaryData(response.data);
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }
  }

  const onBack = () => {
    setNavigationDirection('back')
    dispatch(prevReviewStudyStep())
  };

  useEffect(() => {
    if (navigationDirection === 'back' || navigationDirection === 'forward') {

      GetEthicalApproval();
    }
  }, [navigationDirection]);






  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="study-ethical-approval"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.3 }}
        className=""
      >
        <div className="  flex items-center justify-center">
          
          <h2 className="text-secondary font-medium text-3xl my-1 text-center md:text-left">
            Study Ethical Approval
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
                  label="Ethical Approval Status"
                  type='text'
                  value={summaryData?.ethicalApprovalStatusLabel}
                />
                <BaseInput
                  disabled
                  label="Ethical Approval Attachment"
                  type="text"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <BaseInput
                  disabled
                  label="Date of Submission"
                  type='text'
                  value={formatToDDMMYYYY(summaryData?.dateOfSubmission)}
                />
                <BaseInput
                  disabled
                  label="Date of Approval"
                  type="text"
                  value={formatToDDMMYYYY(summaryData?.dateOfApproval)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <BaseInput disabled label="Name of ethics committee" type="text" value={summaryData?.ethicsCommettees[0]?.name ?? ''} />
                <BaseInput disabled label="Phone of ethical committee" type="text" value={summaryData?.ethicsCommettees[0]?.phone ?? ""} />
                <BaseInput disabled label="Email of ethical committee" type="text" value={summaryData?.ethicsCommettees[0]?.email ?? ""} />
              </div>
            </div>
            <div className='mt-auto pt-6 flex justify-end'>
              <Button type="button" className="w-1/3 py-6" disabled={isFetching} onClick={() => {
                setNavigationDirection('forward')
                dispatch(nextReviewStudyStep())
              }}>
                Next
              </Button>
            </div>

          </div>

        )}

      </motion.div>
    </AnimatePresence >
  )
}

export default ReviewStudyEthical