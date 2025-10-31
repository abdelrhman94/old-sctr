'use client'
import { Button } from '@/components/ui/button'
import { prevReviewStudyStep, selectReviewStudyStep } from '@/store/slices/reviewStudyStepsSlice'
import { ChevronLeft } from 'lucide-react'
import { use, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReviewCollaborations from '../_components/ReviewCollaborations'
import ReviewContractResearch from '../_components/ReviewContractResearch'
import ReviewEligibility from '../_components/ReviewEligibility'
import ReviewFounders from '../_components/ReviewFounders'
import ReviewPlainSummary from '../_components/ReviewPlainSummary'
import ReviewSharingStatement from '../_components/ReviewSharingStatement'
import ReviewSiteInfo from '../_components/ReviewSiteInfo'
import ReviewSponsors from '../_components/ReviewSponsors'
import ReviewStudyBrief from '../_components/ReviewStudyBrief'
import ReviewStudyEthical from '../_components/ReviewStudyEthical'
import ReviewStudyInfo from '../_components/ReviewStudyInfo'

const TOTAL_STEPS = 11

export default function RequestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [navigationDirection, setNavigationDirection] = useState<'forward' | 'back' | 'initial'>('initial');
  const current = useSelector(selectReviewStudyStep)
  const dispatch = useDispatch()
  const onBack = () => {
    setNavigationDirection('back')
    dispatch(prevReviewStudyStep())
  };
  return (
    <section className='p-4'>
      <h2 className='text-[#202020] font-semibold text-3xl my-1'>View Request</h2>
      <section className='my-6 bg-white rounded-2xl border min-h-[600px] grid  justify-items-center p-10 grid-cols-8'>

        {current !== 1 && (
          <Button
            type="button"
            variant="link"
            onClick={onBack}
            //disabled={isFetching}
            className={"col-span-2 col-start-1 w-full !p-0 flex justify-start items-center gap-0.5 !no-underline"}
          >
            <ChevronLeft />
            Back
          </Button>
        )}

        <div className='col-span-6 col-start-2 w-full'>
          <p className='text-[#9C9AA5] text-sm font-medium text-center'>{current} / {TOTAL_STEPS}</p>
          {current === 1 && <ReviewStudyBrief totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} studyId={id} />}
          {current === 2 && <ReviewPlainSummary totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} studyId={id} />}
          {current === 3 && <ReviewSiteInfo totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} studyId={id} />}
          {current === 4 && <ReviewStudyEthical totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} studyId={id} />}
          {current === 5 && <ReviewStudyInfo totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} studyId={id} />}
          {current === 6 && <ReviewEligibility totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} studyId={id} />}
          {current === 7 && <ReviewSponsors totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} studyId={id} />}
          {current === 8 && <ReviewContractResearch totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} studyId={id} />}
          {current === 9 && <ReviewCollaborations totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} studyId={id} />}
          {current === 10 && <ReviewFounders totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} studyId={id} />}
          {current === 11 && <ReviewSharingStatement totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} studyId={id} />}

        </div>
      </section>
    </section>
  )
}