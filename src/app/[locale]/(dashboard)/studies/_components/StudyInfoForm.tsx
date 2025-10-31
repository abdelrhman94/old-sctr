import FormDatePicker from '@/components/shared/FormDatePicker';
import { FormInput } from '@/components/shared/FormInput';
import { FormSelect } from '@/components/shared/FormSelect';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ethicalApprovalOptions } from '@/enums/enums';
import { useGetLookupByNameQuery } from '@/store/api/lookups.Api';
import { useLazyGetStudyInfoQuery, useSaveStudyInfoMutation } from '@/store/api/studiesApi';
import { nextCreateStudyStep } from '@/store/slices/createStudyStepsSlice';
import { StudyInfoFormSchema } from '@/utils/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { z } from "zod";


type Props = {
  totalSteps: number;
  navigationDirection: 'forward' | 'back' | 'initial';
  setNavigationDirection: (state: 'forward' | 'back' | 'initial') => void
}

export type StudyInfoFormValues = z.infer<typeof StudyInfoFormSchema>

const StudyInfoForm = ({ totalSteps, navigationDirection, setNavigationDirection }: Props) => {
  const dispatch = useDispatch()
  const [id] = useQueryState("id");
  const [saveStudyInfo, { isLoading }] = useSaveStudyInfoMutation();
  const [getStudyInfo, { isFetching }] = useLazyGetStudyInfoQuery();

  const { data: siteRequirementsLookup, isLoading: siteRequirementsLoading } = useGetLookupByNameQuery({ name: 'EnumSiteRequirementsStatus' });

  const { data: studyStoppingReasonLookup, isLoading: studyStoppingReasonLoading } = useGetLookupByNameQuery({ name: 'EnumStudyStoppingReason' });

  const { data: sponsorshipLookup, isLoading: sponsorshipLoading } = useGetLookupByNameQuery({ name: 'EnumTypeOfSponsorship' });

  const { data: studyTypeLookup, isLoading: studyTypeLoading } = useGetLookupByNameQuery({ name: 'EnumStudyType' });

  const GetEthicalApproval = async () => {
    try {
      const studyId = id ?? '';
      const response = await getStudyInfo(studyId).unwrap();
      form.reset({
        studyId: id ?? '',
        protocolDate: response.data.protocolDate ?? undefined,
        protocolNumber: response.data.protocolNumber ?? '',
        version: response.data.version ?? '',
        studyStartDate: response.data.studyStartDate ?? undefined,
        studyEndDate: response.data.studyEndDate ?? undefined,
        followUpDuration: response.data.followUpDuration ?? '',
        overallRecruitmentStatus: response.data.overallRecruitmentStatus ?? 0,
        whyStudyStopped: response.data.whyStudyStopped ?? 0,
        whyStudyStoppedText: response.data.whyStudyStoppedText ?? '',
        therapeuticArea: response.data.therapeuticArea ?? 0,
        primaryDiseaseOrCondition: response.data.primaryDiseaseOrCondition ?? 0,
        studyObjective: response.data.studyObjective ?? '',
        primaryOutcomeMeasure: { name: response.data.primaryOutcomeMeasure?.name ?? '', methodofTheMeasurement: response.data.primaryOutcomeMeasure?.methodofTheMeasurement ?? '', time: response.data.primaryOutcomeMeasure?.time ?? '' },
        secondaryOutcomeMeasure: { name: response.data.secondaryOutcomeMeasure?.name ?? '', methodofTheMeasurement: response.data.secondaryOutcomeMeasure?.methodofTheMeasurement ?? '', time: response.data.secondaryOutcomeMeasure?.time ?? '' },
        fdaRegulatedProduct: response.data.fdaRegulatedProduct ?? 0,
        typeOfSponsorship: response.data.typeOfSponsorship ?? 0,
        isIndependentDataSafetyMonitoring: response.data.isIndependentDataSafetyMonitoring ?? false,
        studyType: response.data.studyType ?? 0,
        studyTypeText: response.data.studyTypeText ?? '',
        studyObservational: { observationalStudyModel: response.data.studyObservational?.observationalStudyModel ?? undefined, observationalStudyModelText: response.data.studyObservational?.observationalStudyModelText ?? '', studyPurpose: response.data.studyObservational?.studyPurpose ?? undefined, studyPurposeText: response.data.studyObservational?.studyPurposeText ?? '', timeProspective: response.data.studyObservational?.timeProspective ?? undefined, timeProspectiveText: response.data.studyObservational?.timeProspectiveText ?? '', patientRegistryInformation: response.data.studyObservational?.patientRegistryInformation ?? '', groups: [], groupCrossReference: response.data.studyObservational?.groupCrossReference ?? '' },
        studyInterventional: { primaryPurpose: response.data.studyInterventional?.primaryPurpose ?? undefined, primaryPurposeText: response.data.studyInterventional?.primaryPurposeText ?? '', studyPhase: response.data.studyInterventional?.studyPhase ?? undefined, typeOfEndpoint: response.data.studyInterventional?.typeOfEndpoint ?? undefined, studyModel: response.data.studyInterventional?.studyModel ?? undefined, studyModelText: response.data.studyInterventional?.studyModelText ?? '', randomization: response.data.studyInterventional?.randomization ?? undefined, methodOfRandomization: response.data.studyInterventional.methodOfRandomization },
      })
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }

  }

  const form = useForm<StudyInfoFormValues>({
    resolver: zodResolver(StudyInfoFormSchema),
    defaultValues: {
      studyId: id ?? '',
      protocolDate: undefined,
      protocolNumber: "",
      version: '',
      studyStartDate: undefined,
      studyEndDate: undefined,
      followUpDuration: '',
      overallRecruitmentStatus: undefined,
      whyStudyStopped: undefined,
      whyStudyStoppedText: '',
      therapeuticArea: undefined,
      primaryDiseaseOrCondition: undefined,
      studyObjective: '',
      primaryOutcomeMeasure: { name: '', methodofTheMeasurement: '', time: '' },
      secondaryOutcomeMeasure: { name: '', methodofTheMeasurement: '', time: '' },
      fdaRegulatedProduct: undefined,
      typeOfSponsorship: undefined,
      isIndependentDataSafetyMonitoring: false,
      studyType: undefined,
      studyTypeText: '',
      studyObservational: { observationalStudyModel: undefined, observationalStudyModelText: '', studyPurpose: undefined, studyPurposeText: '', timeProspective: undefined, timeProspectiveText: '', patientRegistryInformation: '', groups: [], groupCrossReference: '' },
      studyInterventional: { primaryPurpose: undefined, primaryPurposeText: '', studyPhase: undefined, typeOfEndpoint: undefined, studyModel: undefined, studyModelText: '', randomization: undefined, methodOfRandomization: '' },
    },
  })

  const onSaveDraft = async () => {
    try {
      const raw = form.getValues();
      const payload = { ...raw, isDraft: true };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const response = await saveStudyInfo(payload).unwrap();
      toast.success(response?.message ?? "Draft saved");
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ??
        (error as { message?: string })?.message ??
        "Something went wrong";

      toast.error(errorMessage);
    }

  };
  const onSubmit = async (data: StudyInfoFormValues) => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const response = await saveStudyInfo({ ...data, isDraft: false }).unwrap();
      dispatch(nextCreateStudyStep())
      toast.success(response?.message);
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";

      toast.error(errorMessage);
    }
  };



  useEffect(() => {
    if (navigationDirection === 'back') {
      GetEthicalApproval();
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
        <div className="grid grid-cols-4 items-center">
          <h2 className="col-span-2 col-start-2 text-secondary font-medium text-3xl my-1 text-center">
            Study information
          </h2>
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            disabled={isLoading || isFetching}
            className="justify-self-end"
          >
            Save draft
          </Button>
        </div>
        {isFetching ? (
          <div className="flex justify-center items-center h-[400px]">
            <Loader2 size={100} className="animate-spin text-primary" />
          </div>
        ) : (
          <FormProvider {...form}>
            <Form {...form} >
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col min-h-[400px]">
                <div className="flex-grow space-y-8 my-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <FormDatePicker
                      placeholder=""
                      name="protocolDate"
                      label="Protocol Date"
                      minDate={new Date(2000, 0, 1)}
                      maxDate={new Date()}
                      displayFormat="dd/MM/yyyy"
                    />
                    <FormInput name="protocolNumber" label="Protocol Number" type="text" placeholder="" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <FormInput name="version" label="Version" type="text" placeholder="" />
                    <FormDatePicker
                      placeholder=""
                      name="studyStartDate"
                      label="Study Start Date"
                      minDate={new Date(2000, 0, 1)}
                      maxDate={new Date()}
                      displayFormat="dd/MM/yyyy"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <FormDatePicker
                      placeholder=""
                      name="studyEndDate"
                      label="Study End Date"
                      minDate={new Date(2000, 0, 1)}
                      maxDate={new Date()}
                      displayFormat="dd/MM/yyyy"
                    />
                    <FormInput name="followUpDuration" label="Follow-Up Duration" type="text" placeholder="" />

                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <FormSelect
                      name="overallRecruitmentStatus"
                      label="Overall Recruitment Status"
                      placeholder='Select…'
                      valueType="number"
                      readingId
                      loading={siteRequirementsLoading}
                      options={siteRequirementsLookup?.data?.EnumSiteRequirementsStatus || []}
                    />
                    <FormSelect
                      name="whyStudyStopped"
                      label="Why Study Stopped"
                      placeholder='Select…'
                      valueType="number"
                      readingId
                      loading={studyStoppingReasonLoading}
                      options={studyStoppingReasonLookup?.data?.EnumStudyStoppingReason || []}
                    />

                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <FormInput name="whyStudyStoppedText" label="Why Study Stopped" type="text" placeholder="" />
                    <FormSelect
                      name="therapeuticArea"
                      label="Therapeutic Area"
                      placeholder='Select…'
                      valueType="number"
                      options={ethicalApprovalOptions}
                    />

                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <FormInput name="primaryDiseaseOrCondition" label="Primary Disease Or Condition Being Studied in The Trial" type="number" placeholder="" />
                    <FormInput name="studyObjective" label="Study Objective(s)" type="text" placeholder="" />

                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <FormInput name="primaryOutcomeMeasure.name" label="Primary Outcome Measure Name" type="text" placeholder="" />
                    <FormInput name="primaryOutcomeMeasure.methodofTheMeasurement" label="Primary Outcome Measure Measurement" type="text" placeholder="" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <FormInput name="primaryOutcomeMeasure.time" label="Primary Outcome Measure Time" type="text" placeholder="" />
                    <FormInput name="secondaryOutcomeMeasure.name" label="Secondary Outcome Measure Name" type="text" placeholder="" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <FormInput name="secondaryOutcomeMeasure.methodofTheMeasurement" label="Secondary Outcome Measure Measurement" type="text" placeholder="" />
                    <FormInput name="secondaryOutcomeMeasure.time" label="Secondary Outcome Measure Time" type="text" placeholder="" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <FormInput name="fdaRegulatedProduct" label="Type of Saudi FDA-Regulated Product" type="number" placeholder="" />
                    <FormSelect
                      name="typeOfSponsorship"
                      label="Type of Sponsorship"
                      placeholder='Select…'
                      valueType="number"
                      readingId
                      loading={sponsorshipLoading}
                      options={sponsorshipLookup?.data?.EnumTypeOfSponsorship || []}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <FormInput name="isIndependentDataSafetyMonitoring" label="Is there an independent data safety monitoring board?" type="text" placeholder="" />
                    <FormSelect
                      name="studyType"
                      label="Study type"
                      placeholder='Select…'
                      valueType="number"
                      readingId
                      loading={studyTypeLoading}
                      options={studyTypeLookup?.data?.EnumStudyType || []}
                    />
                  </div>
                </div>

                <div className='mt-auto pt-6 flex justify-end'>
                  <Button type="submit" className="w-1/3 py-6" disabled={isLoading}>
                    Next
                  </Button>
                </div>
              </form>
            </Form>
          </FormProvider>
        )}
      </motion.div>
    </AnimatePresence >
  )
}

export default StudyInfoForm