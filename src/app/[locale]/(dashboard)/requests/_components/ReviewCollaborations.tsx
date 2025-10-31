import { BaseInput } from "@/components/shared/BaseInput";
import { Button } from "@/components/ui/button";
import { SaveCollaborationRequest } from "@/models/Studies.model";
import { useLazyGetCollaborationsQuery } from "@/store/api/studiesApi";
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
const ReviewCollaborations = ({ navigationDirection, studyId, setNavigationDirection }: Props) => {
  const dispatch = useDispatch()
  const [summaryData, setSummaryData] = useState<SaveCollaborationRequest>();
  const [getCollaboration, { isFetching }] = useLazyGetCollaborationsQuery();

  const GetCollaboration = async () => {
    try {
      const response = await getCollaboration(studyId).unwrap();
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

      GetCollaboration();
    }
  }, [navigationDirection]);

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
        <div className="  flex items-center justify-center">
          
          <h2 className="text-secondary font-medium text-3xl my-1 text-center md:text-left">
            Collaborations
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
                    label="Is there any collaboration for this study?"
                  type="text"
                  value={summaryData?.isThereAnyCollaboration ? "Yes" : 'No collaboration'}
                />
              </div>
              {summaryData?.isThereAnyCollaboration && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <BaseInput
                      disabled
                      label="Collaborator Name"
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
                      value={summaryData?.website}
                    />
                    <BaseInput
                      disabled
                      label="Designation"
                      type="text"
                      value={summaryData?.designation}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <BaseInput
                      disabled
                      label="Public Contact Name"
                      type="text"
                      value={summaryData?.publicContact?.fullName}
                    />
                    <BaseInput
                      disabled
                      label="Public Contact Email"
                      type="text"
                      value={summaryData?.publicContact?.email}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <BaseInput
                      disabled
                      label="Public Contact Phone"
                      type="text"
                      value={summaryData?.publicContact?.phoneNumber}
                    />
                    <BaseInput
                      disabled
                      label="Scientific Contact Name"
                      type="text"
                      value={summaryData?.scientificContact?.fullName}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <BaseInput
                      disabled
                      label="Scientific Contact Email"
                      type="text"
                      value={summaryData?.scientificContact?.email}
                    />
                    <BaseInput
                      disabled
                      label="Scientific Contact Phone"
                      type="text"
                      value={summaryData?.scientificContact?.phoneNumber}
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

export default ReviewCollaborations