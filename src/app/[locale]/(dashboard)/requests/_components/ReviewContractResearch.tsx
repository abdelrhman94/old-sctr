import { BaseInput } from "@/components/shared/BaseInput";
import { Button } from "@/components/ui/button";
import { SaveCroRequest } from "@/models/Studies.model";
import { useLazyGetCroQuery } from "@/store/api/studiesApi";
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
const ReviewContractResearch = ({ navigationDirection, studyId, setNavigationDirection }: Props) => {
  const dispatch = useDispatch()
  const [summaryData, setSummaryData] = useState<SaveCroRequest>();
  const [getCro, { isFetching }] = useLazyGetCroQuery();

  const GetCro = async () => {
    try {
      const response = await getCro(studyId).unwrap();
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

      GetCro();
    }
  }, [navigationDirection]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="ContractResearchOrganizat"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.3 }}
        className=""
      >
        <div className="  flex items-center justify-center">
          
          <h2 className="text-secondary font-medium text-3xl my-1 text-center md:text-left">
            Contract Research Organization
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
                  label="Is there any activity of the study to be conducted by a
Contract Research Organization (CRO)?"
                  type="text"
                  value={summaryData?.isThereAnyCRO ? "Yes" : 'No Contract Research Organization'}
                />
              </div>
              {summaryData?.isThereAnyCRO && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <BaseInput
                      disabled
                      label="Contract Research Organization Name"
                      type="text"
                      value={summaryData?.name}
                    />
                    <BaseInput
                      disabled
                      label="Country"
                      type="text"
                      value={summaryData?.country}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <BaseInput
                      disabled
                      label="Region"
                      type="text"
                      value={summaryData?.region}
                    />
                    <BaseInput
                      disabled
                      label="City"
                      type="text"
                      value={summaryData?.city}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <BaseInput
                      disabled
                      label="Postcode"
                      type="text"
                      value={summaryData?.postcode}
                    />
                    <BaseInput
                      disabled
                      label="Phone"
                      type="text"
                      value={summaryData?.tel}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <BaseInput
                      disabled
                      label="Website"
                      type="text"
                      value={summaryData?.croWebsite}
                    />
                    <BaseInput
                      disabled
                      label="Role or Services"
                      type="text"
                      value={summaryData?.roleOrServices}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <BaseInput
                      disabled
                      label="Other Role or Services"
                      type="text"
                      value={summaryData?.otherRoleOrServices}
                    />
                  </div>
                 
                </>
              )}
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
    </AnimatePresence>
  )
}

export default ReviewContractResearch