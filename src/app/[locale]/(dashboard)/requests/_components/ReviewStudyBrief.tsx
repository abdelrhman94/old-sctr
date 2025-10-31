import { BaseInput } from '@/components/shared/BaseInput';
import { Button } from '@/components/ui/button';
import { useGetStudyBriefQuery } from '@/store/api/studiesApi';
import { nextReviewStudyStep } from '@/store/slices/reviewStudyStepsSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

type Props = {
  totalSteps: number;
  studyId: string;
  navigationDirection: 'forward' | 'back' | 'initial';
  setNavigationDirection: (state: 'forward' | 'back' | 'initial') => void
}

const ReviewStudyBrief = ({ setNavigationDirection, studyId }: Props) => {
  const dispatch = useDispatch()
  const { data: StudyBrief, isLoading, isError, error } = useGetStudyBriefQuery(studyId);





  if (isError) {
    const errorMessage =
      (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
      "Something went wrong";
    toast.error(errorMessage);
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="studyBrief"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.3 }}
        className=""
      >
        <div className="relative  flex items-center justify-center">
          <h2 className="text-secondary font-medium text-3xl my-1 text-center md:text-left">
            Title & additional Identifiers
          </h2>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Loader2 size={100} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className='flex flex-col min-h-[400px]'>
            <div className="flex-grow space-y-8 my-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <BaseInput value={StudyBrief?.data?.studyId} label="Record Number" type="text" disabled />
                <BaseInput value={StudyBrief?.data?.acronym} label="SCTR Registration Number" type="text" placeholder="" disabled />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <BaseInput name="dateOfRegistration" value={StudyBrief?.data?.acronym} label="Date of registration in SCTR" type="text" placeholder="" disabled />
                <BaseInput name="scientificTitle" value={StudyBrief?.data?.scientificTitle} label="Scientific Title" type="text" placeholder="" disabled />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <BaseInput name="publicTitleEn" value={StudyBrief?.data?.publicTitleEn} label="Public Title (English)" type="text" placeholder="" disabled />
                <BaseInput name="publicTitleAr" value={StudyBrief?.data?.publicTitleAr} label="Public Title (Arabic)" type="text" placeholder="" disabled />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <BaseInput name="acronym" value={StudyBrief?.data?.acronym} label="Acronym" type="text" placeholder="" disabled style={"min-h-20"} />
                <BaseInput name="secondaryIdentifyingNumbers" value={StudyBrief?.data?.secondaryIdentifyingNumbers} label="Secondary Identifying Numbers" type="text" placeholder="" disabled />
              </div>
            </div>
            <div className='mt-auto pt-6 flex justify-end'>
              <Button type="button" className="w-1/3 py-6" disabled={isLoading} onClick={() => {
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

export default ReviewStudyBrief