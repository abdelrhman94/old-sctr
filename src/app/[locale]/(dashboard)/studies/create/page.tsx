'use client'
import { Button } from '@/components/ui/button';
import { prevCreateStudyStep, selectCreateStudyStep } from '@/store/slices/createStudyStepsSlice';
import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CollaborationsForm from '../_components/CollaborationsForm';
import ContractResearchForm from '../_components/ContractResearchForm';
import EligibilityForm from '../_components/EligibilityForm';
import FoundersForm from '../_components/FundersForm';
import PlainSummaryForm from '../_components/PlainSummaryForm';
import SharingStatementForm from '../_components/SharingStatementForm';
import SiteInfoForm from '../_components/SiteInfoForm';
import SponsorsForm from '../_components/SponsorsForm';
import StudyBriefForm from '../_components/StudyBriefForm';
import StudyEthicalForm from '../_components/StudyEthicalForm';
import StudyInfoForm from '../_components/StudyInfoForm';



const TOTAL_STEPS = 11

const CreateStudyPage = () => {
  const t = useTranslations('CreateStudyPage');
  const dispatch = useDispatch()
  const [navigationDirection, setNavigationDirection] = useState<'forward' | 'back' | 'initial'>('initial');

  const onBack = () => {
    setNavigationDirection('back')
    dispatch(prevCreateStudyStep())
  };

  const current = useSelector(selectCreateStudyStep)
  return (
    <section className='p-4'>
      <h2 className='text-[#202020] font-semibold text-3xl my-1'>{t('title')}</h2>
      <section className='my-6 bg-white rounded-2xl border min-h-[600px] grid  justify-items-center p-10 grid-cols-8'>
        {current !== 1 && (
          <Button
            type="button"
            variant="link"
            onClick={onBack}
            className={"col-span-2 col-start-1 w-full !p-0 flex justify-start items-center gap-0.5 !no-underline"}
          >
            <ChevronLeft />
            Back
          </Button>
        )}
        <div className='col-span-6 col-start-2 w-full'>
          <p className='text-[#9C9AA5] text-sm font-medium text-center'>{current} / {TOTAL_STEPS}</p>
          {current === 1 && <StudyBriefForm totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} />}
          {current === 2 && <PlainSummaryForm totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} />}
          {current === 3 && <SiteInfoForm totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} />}
          {current === 4 && <StudyEthicalForm totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} />}
          {current === 5 && <StudyInfoForm totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} />}
          {current === 6 && <EligibilityForm totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} />}
          {current === 7 && <SponsorsForm totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} />}
          {current === 8 && <ContractResearchForm totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} />}
          {current === 9 && <CollaborationsForm totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} />}
          {current === 10 && <FoundersForm totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} />}
          {current === 11 && <SharingStatementForm totalSteps={TOTAL_STEPS} navigationDirection={navigationDirection} setNavigationDirection={setNavigationDirection} />}
        </div>
      </section>
    </section>
  )
}

export default CreateStudyPage


