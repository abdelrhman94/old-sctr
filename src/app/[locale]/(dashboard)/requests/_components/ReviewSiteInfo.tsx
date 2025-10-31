import { BaseInput } from '@/components/shared/BaseInput';
import { Button } from '@/components/ui/button';
import { GetSiteInformationRequest } from '@/models/Studies.model';
import { useLazyGetSiteInformationQuery } from '@/store/api/studiesApi';
import { nextReviewStudyStep, prevReviewStudyStep } from '@/store/slices/reviewStudyStepsSlice';
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
const ReviewSiteInfo = ({ navigationDirection, studyId, setNavigationDirection }: Props) => {
  const dispatch = useDispatch()
  const [summaryData, setSummaryData] = useState<GetSiteInformationRequest>();
  const [getSiteInformation, { isFetching }] = useLazyGetSiteInformationQuery();


  const GetSiteInformation = async () => {
    try {
      const response = await getSiteInformation(studyId).unwrap();
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
      GetSiteInformation();
    }
  }, [navigationDirection]);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="site-info"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.3 }}
        className=""
      >
        <div className="  flex items-center justify-center">
          
          <h2 className="text-secondary font-medium text-3xl my-1 text-center md:text-left">
            Site Information
          </h2>
        </div>
        {isFetching ? (
          <div className="flex justify-center items-center h-[400px]">
            <Loader2 size={100} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className='flex flex-col min-h-[400px]'>
            <div className="flex-grow space-y-8 my-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <BaseInput
                  disabled
                  label="City"
                  type='text'
                  value={summaryData?.citiesLabel}
                />
                <BaseInput
                  disabled
                  label="Region"
                  type='text'
                  value={summaryData?.regionsLabel}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <BaseInput disabled label="Site Name (English)" type="text" value={summaryData?.siteNameEn} />
                <BaseInput disabled label="Site Name (Arabic)" type="text" value={summaryData?.siteNameAr} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <BaseInput
                  disabled
                  label="PI Title"
                  type='text'
                  value={summaryData?.piTitle}
                />
                <BaseInput disabled label="PI First Name" type="text" value={summaryData?.piFirstNme} />

              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <BaseInput disabled label="PI Family Name" type="text" value={summaryData?.piFamilyNme} />
                <BaseInput
                  disabled
                  label="PI City"
                  type='text'
                  value={summaryData?.piCityLabel}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <BaseInput
                  disabled
                  label="PI Region"
                  type='text'
                  value={summaryData?.piRegionLabel}
                />
                <BaseInput disabled label="PI Scientific Contact - Full Name" type="text" value={summaryData?.piContactForScientific?.fullName} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <BaseInput disabled label="PI Scientific Contact - Phone" type="text" value={summaryData?.piContactForScientific?.phoneNumber} />
                <BaseInput disabled label="PI Scientific Contact - Email" type="text" value={summaryData?.piContactForScientific?.email} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <BaseInput disabled label="PI Contact - Full Name" type="text" value={summaryData?.piContactForPublic?.fullName} />
                <BaseInput disabled label="PI Contact - Phone" type="text" value={summaryData?.piContactForPublic?.phoneNumber} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <BaseInput disabled label="PI Contact - Email" type="text" value={summaryData?.piContactForPublic?.email} />
                <BaseInput disabled label="Public Contact - Full Name" type="text" value={summaryData?.publicContact?.fullName} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <BaseInput disabled label="Public Contact - Phone" type="text" value={summaryData?.publicContact?.phoneNumber} />
                <BaseInput disabled label="Public Contact - Email" type="text" value={summaryData?.publicContact?.email} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <BaseInput disabled label="PI Contact - Full Name" type="text" value={summaryData?.scientificContact?.fullName} />
                <BaseInput disabled label="PI Contact - Phone" type="text" value={summaryData?.scientificContact?.phoneNumber} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <BaseInput disabled label="Scientific Contact - Email" type="text" value={summaryData?.scientificContact?.email} />
                <BaseInput
                  disabled
                  label="Site Recruitment Status"
                  type='text'
                  value={summaryData?.siteRequirementsStatusLabel}
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
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default ReviewSiteInfo