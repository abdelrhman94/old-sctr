import FormDatePicker from '@/components/shared/FormDatePicker';
import { FormInput } from '@/components/shared/FormInput';
import { FormSelect } from '@/components/shared/FormSelect';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useGetLookupByNameQuery } from '@/store/api/lookups.Api';
import { useLazyGetEligibilityQuery, useSaveEligibilityMutation } from '@/store/api/studiesApi';
import { nextCreateStudyStep, prevCreateStudyStep } from '@/store/slices/createStudyStepsSlice';
import { EligibilitySchema } from '@/utils/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Loader2 } from 'lucide-react';
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

export type EligibilityValues = z.infer<typeof EligibilitySchema>;
const EligibilityForm = ({ navigationDirection, setNavigationDirection }: Props) => {
  const dispatch = useDispatch()
  const [id] = useQueryState("id");
  const [saveEligibility, { isLoading }] = useSaveEligibilityMutation();
  const [getEligibility, { isFetching }] = useLazyGetEligibilityQuery();
  const { data: participantTypeLookup, isLoading: participantTypeLoading } = useGetLookupByNameQuery({ name: 'EnumParticipantType' });
  const { data: participantGenderLookup, isLoading: participantGenderLoading } = useGetLookupByNameQuery({ name: 'EnumGender' });
  const { data: locationOfStudyLookup, isLoading: locationOfStudyLoading } = useGetLookupByNameQuery({ name: 'EnumLocationOfStudy' });

  const GetEligibility = async () => {
    try {
      const studyId = id ?? '';
      const response = await getEligibility(studyId).unwrap();
      form.reset({
        studyId: id ?? '',
        participantType: response.data.participantType ?? undefined,
        ageLimit: response.data.ageLimit ?? '',
        participantGender: response.data.participantGender ?? undefined,
        inclusionExclusion: response.data.inclusionExclusion ?? '',
        locationOfStudy: response.data.locationOfStudy ?? undefined,
        targetInSaudi: response.data.targetInSaudi ?? undefined,
        targetGlobal: response.data.targetGlobal ?? undefined,
        actualEnrolledSaudi: response.data.actualEnrolledSaudi ?? undefined,
        recruitmentStartSaudi: response.data.recruitmentStartSaudi ?? undefined,
        recruitmentEndSaudi: response.data.recruitmentEndSaudi ?? undefined,
        recruitmentStartGlobal: response.data.recruitmentStartGlobal ?? undefined,
        recruitmentEndGlobal: response.data.recruitmentEndGlobal ?? undefined,
      })
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";

      toast.error(errorMessage);
    }

  }

  const form = useForm<EligibilityValues>({
    resolver: zodResolver(EligibilitySchema),
    defaultValues: {
      studyId: id ?? '',
      participantType: undefined,
      ageLimit: '',
      participantGender: undefined,
      inclusionExclusion: '',
      locationOfStudy: undefined,
      targetInSaudi: undefined,
      targetGlobal: undefined,
      actualEnrolledSaudi: undefined,
      recruitmentStartSaudi: undefined,
      recruitmentEndSaudi: undefined,
      recruitmentStartGlobal: undefined,
      recruitmentEndGlobal: undefined,
    },
  })

  const onSaveDraft = async () => {
    try {
      const raw = form.getValues();
      const payload = { ...raw, isDraft: true };
      const response = await saveEligibility(payload).unwrap();
      toast.success(response?.message ?? "Draft saved");
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ??
        (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }
  };
  const onSubmit = async (data: EligibilityValues) => {
    try {
      const response = await saveEligibility({ ...data, isDraft: false }).unwrap();
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
      GetEligibility();
    }
  }, [navigationDirection]);


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
        <div className="grid grid-cols-4 items-center">
          <h2 className="col-span-2 col-start-2 text-secondary font-medium text-3xl my-1 text-center">
            Eligibility
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
                    <FormSelect
                      name="participantType"
                      label="Participant type"
                      placeholder='Select…'
                      valueType="number"
                      readingId
                      loading={participantTypeLoading}
                      options={participantTypeLookup?.data?.EnumParticipantType || []}
                    />
                    <FormInput name="ageLimit" label="Age Limits" type="text" placeholder="" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <FormSelect
                      name="participantGender"
                      label="Participants Gender"
                      placeholder='Select…'
                      valueType="number"
                      readingId
                      loading={participantGenderLoading}
                      options={participantGenderLookup?.data?.EnumGender || []}
                    />
                    <FormInput name="inclusionExclusion" label="Participants inclusion/ exclusion criteria" type="text" placeholder="" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <FormSelect
                      name="locationOfStudy"
                      label="Location of the study site"
                      placeholder='Select…'
                      valueType="number"
                      readingId
                      loading={locationOfStudyLoading}
                      options={locationOfStudyLookup?.data?.EnumLocationOfStudy || []}
                    />
                    <FormInput name="targetGlobal" label="Target number of participants globally" type="number" placeholder="" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <FormInput name="targetInSaudi" label="Target number of participants in Saudi Arabia" type="number" placeholder="" />
                    <FormInput name="actualEnrolledSaudi" label="Actual number of participants enrolled in Saudi Arabia" type="number" placeholder="" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <FormDatePicker
                      placeholder=""
                      name="recruitmentStartSaudi"
                      label="Recruitment start date in Saudi Arabia"
                      minDate={new Date(2000, 0, 1)}
                      maxDate={new Date()}
                      displayFormat="dd/MM/yyyy"
                    />
                    <FormDatePicker
                      placeholder=""
                      name="recruitmentEndSaudi"
                      label="Recruitment end date in Saudi Arabia"
                      minDate={new Date(2000, 0, 1)}
                      maxDate={new Date()}
                      displayFormat="dd/MM/yyyy"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <FormDatePicker
                      placeholder=""
                      name="recruitmentStartGlobal"
                      label="Recruitment start date globally"
                      minDate={new Date(2000, 0, 1)}
                      maxDate={new Date()}
                      displayFormat="dd/MM/yyyy"
                    />
                    <FormDatePicker
                      placeholder=""
                        name="recruitmentEndGlobal"
                      label="Recruitment end date globally"
                      minDate={new Date(2000, 0, 1)}
                      maxDate={new Date()}
                      displayFormat="dd/MM/yyyy"
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

export default EligibilityForm