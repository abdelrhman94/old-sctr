import { BaseInput } from "@/components/shared/BaseInput";
import { Button } from "@/components/ui/button";
import { SaveStudyInfoRequest } from "@/models/Studies.model";
import { useLazyGetStudyInfoQuery } from "@/store/api/studiesApi";
import { nextReviewStudyStep, prevReviewStudyStep } from "@/store/slices/reviewStudyStepsSlice";
import { formatToDDMMYYYY } from "@/utils/dates";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

type Props = {
  totalSteps: number;
  studyId: string;
  navigationDirection: 'forward' | 'back' | 'initial';
  setNavigationDirection: (state: 'forward' | 'back' | 'initial') => void
}
const ReviewStudyInfo = ({ navigationDirection, studyId, setNavigationDirection }: Props) => {
  const dispatch = useDispatch()
  const [summaryData, setSummaryData] = useState<SaveStudyInfoRequest>();
  const [getStudyInfo, { isFetching }] = useLazyGetStudyInfoQuery();

  const GetStudyInfo = async () => {
    try {
      const response = await getStudyInfo(studyId).unwrap();
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
      GetStudyInfo();
    }
  }, [navigationDirection]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="study-info"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.3 }}
        className=""
      >
        <div className="  flex items-center justify-center">
          <h2 className="text-secondary font-medium text-3xl my-1 text-center md:text-left">
            Study information
          </h2>
        </div>
        {
          isFetching ? (<div className="flex justify-center items-center h-[400px]">
            <Loader2 size={100} className="animate-spin text-primary" />
          </div>) : (
            <div className="flex flex-col min-h-[400px]">
              <div className="flex-grow space-y-8 my-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <BaseInput
                    disabled
                    label="Protocol Date"
                    type="text"
                    value={formatToDDMMYYYY(summaryData?.protocolDate)}
                  />
                  <BaseInput disabled label="Protocol Number" type="text" value={summaryData?.protocolNumber} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <BaseInput disabled label="Version" type="text" value={summaryData?.version} />
                  <BaseInput
                    disabled
                    label="Study Start Date"
                    type="text"
                    value={formatToDDMMYYYY(summaryData?.studyStartDate)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <BaseInput
                    disabled
                    label="Study End Date"
                    type="text"
                    value={formatToDDMMYYYY(summaryData?.studyEndDate)}
                  />
                  <BaseInput
                    disabled
                    label="Follow-Up Duration"
                    type="text"
                    value={summaryData?.followUpDuration} />

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <BaseInput
                    disabled
                    label="Overall Recruitment Status"
                    type="text"
                    value={summaryData?.overallRecruitmentStatusLabel}
                  />
                  <BaseInput
                    disabled
                    label="Why Study Stopped"
                    type="text"
                    value={summaryData?.whyStudyStoppedLabel}
                  />

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <BaseInput disabled label="Why Study Stopped" type="text" value={summaryData?.whyStudyStoppedLabel} />
                  <BaseInput
                    disabled
                    label="Therapeutic Area"
                    type="text"
                    value={summaryData?.therapeuticAreaLabel}
                  />

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <BaseInput disabled label="Primary Disease Or Condition Being Studied in The Trial" type="text" value={summaryData?.primaryDiseaseOrConditionLabel} />
                  <BaseInput disabled label="Study Objective(s)" type="text" value={summaryData?.studyObjective} />

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <BaseInput disabled label="Primary Outcome Measure Name" type="text" value={summaryData?.primaryOutcomeMeasure?.name} />
                  <BaseInput disabled label="Primary Outcome Measure Measurement" type="text" value={summaryData?.primaryOutcomeMeasure?.methodofTheMeasurement} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <BaseInput disabled label="Primary Outcome Measure Time" type="text" value={summaryData?.primaryOutcomeMeasure?.time} />
                  <BaseInput disabled label="Secondary Outcome Measure Name" type="text" value={summaryData?.secondaryOutcomeMeasure?.name} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <BaseInput disabled label="Secondary Outcome Measure Measurement" type="text" value={summaryData?.secondaryOutcomeMeasure?.methodofTheMeasurement} />
                  <BaseInput disabled label="Secondary Outcome Measure Time" type="text" value={summaryData?.secondaryOutcomeMeasure?.time} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <BaseInput disabled label="Type of Saudi FDA-Regulated Product" type="text" value={summaryData?.fdaRegulatedProductLabel} />
                  <BaseInput
                    disabled
                    label="Type of Sponsorship"
                    type="text"
                    value={summaryData?.typeOfSponsorshipLabel}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <BaseInput disabled label="Is there an independent data safety monitoring board?" type="text" value={summaryData?.isIndependentDataSafetyMonitoring ? 'Yes' : 'No'} />
                  <BaseInput
                    disabled
                    label="Study type"
                    type="text"
                    value={summaryData?.studyTypeLabel}
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
    </AnimatePresence>
  )
}

export default ReviewStudyInfo