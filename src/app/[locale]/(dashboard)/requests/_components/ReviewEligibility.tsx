import { BaseInput } from "@/components/shared/BaseInput";
import { Button } from "@/components/ui/button";
import { SaveEligibilityRequest } from "@/models/Studies.model";
import { useLazyGetEligibilityQuery } from "@/store/api/studiesApi";
import { nextReviewStudyStep, prevReviewStudyStep } from "@/store/slices/reviewStudyStepsSlice";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

type Props = {
  totalSteps: number;
  studyId: string;
  navigationDirection: 'forward' | 'back' | 'initial';
  setNavigationDirection: (state: 'forward' | 'back' | 'initial') => void
}
const ReviewEligibility = ({ navigationDirection, studyId, setNavigationDirection }: Props) => {
  const dispatch = useDispatch()
  const [summaryData, setSummaryData] = useState<SaveEligibilityRequest>();
  const [getEligibility, { isFetching }] = useLazyGetEligibilityQuery();

  const GetEligibility = async () => {
    try {
      const response = await getEligibility(studyId).unwrap();
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

      GetEligibility();
    }
  }, [navigationDirection]);


  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="eligibility"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.3 }}
        className=""
      >
        <div className="  flex items-center justify-center">
          
          <h2 className="text-secondary font-medium text-3xl my-1 text-center md:text-left">
            Eligibility
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
                  label="Participant type"
                  type='text'
                  value={summaryData?.participantType}
                />
                <BaseInput
                  disabled
                  label="Age Limits"
                  type='text'
                  value={summaryData?.ageLimit}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <BaseInput
                  disabled
                  label="Participants Gender"
                  type='text'
                  value={summaryData?.participantGenderLabel}
                />
                <BaseInput
                  disabled
                  label="Participants inclusion/ exclusion criteria"
                  type='text'
                  value={summaryData?.inclusionExclusion}
                />
              </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <BaseInput
                    disabled
                    label="Location of the study site"
                    type='text'
                    value={summaryData?.locationOfStudyLabel}
                  />
                  <BaseInput
                    disabled
                    label="Target number of participants globally"
                    type='text'
                    value={summaryData?.targetGlobal}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <BaseInput
                    disabled
                    label="Target number of participants in Saudi Arabia"
                    type='text'
                    value={summaryData?.targetInSaudi}
                  />
                  <BaseInput
                    disabled
                    label="Actual number of participants enrolled in Saudi Arabia"
                    type='text'
                    value={summaryData?.actualEnrolledSaudi}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <BaseInput
                    disabled
                    label="Recruitment start date in Saudi Arabia"
                    type='text'
                    value={summaryData?.recruitmentStartSaudi}
                  />
                  <BaseInput
                    disabled
                    label="Recruitment end date in Saudi Arabia"
                    type='text'
                    value={summaryData?.recruitmentEndSaudi}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <BaseInput
                    disabled
                    label="Recruitment start date globally"
                    type='text'
                    value={summaryData?.recruitmentStartGlobal}
                  />
                  <BaseInput
                    disabled
                    label="Recruitment end date globally"
                    type='text'
                    value={summaryData?.recruitmentEndGlobal}
                  />
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
        )
        }

      </motion.div>
    </AnimatePresence >
  )
}

export default ReviewEligibility