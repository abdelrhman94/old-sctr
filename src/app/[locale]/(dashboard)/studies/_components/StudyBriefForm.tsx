import { FormInput } from '@/components/shared/FormInput'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useLazyGetStudyBriefQuery, useSaveStudyBriefMutation } from '@/store/api/studiesApi'
import { nextCreateStudyStep } from '@/store/slices/createStudyStepsSlice'
import { formatToDDMMYYYY } from '@/utils/dates'
import { StudyBriefSchema } from '@/utils/validationSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from "lucide-react"
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { z } from "zod"

type Props = {
  totalSteps: number;
  navigationDirection: 'forward' | 'back' | 'initial';
  setNavigationDirection: (state: 'forward' | 'back' | 'initial') => void
}

export type StudyBriefValues = z.infer<typeof StudyBriefSchema>;

const StudyBriefForm = ({ navigationDirection }: Props) => {
  const dispatch = useDispatch()
  const [id] = useQueryState("id");
  const [recordNumber] = useQueryState("recordNumber");
  const [registrationNumber] = useQueryState("registrationNumber");
  const [dateOfRegistration] = useQueryState("dateOfRegistration");

  const [saveStudyBrief, { isLoading }] = useSaveStudyBriefMutation();
  const [getStudyBrief, { isFetching }] = useLazyGetStudyBriefQuery();

  const form = useForm<StudyBriefValues>({
    resolver: zodResolver(StudyBriefSchema),
    defaultValues: {
      studyId: id ?? '',
      recordNumber: recordNumber ?? "",
      registrationNumber: registrationNumber ?? "",
      dateOfRegistration: formatToDDMMYYYY(dateOfRegistration) ?? "",
      publicTitleAr: "",
      publicTitleEn: "",
      scientificTitle: "",
      acronym: "",
      secondaryIdentifyingNumbers: "",
    },
  })



  const GetStudyBrief = async () => {
    try {
      const studyId = id ?? '';
      const response = await getStudyBrief(studyId).unwrap();
      form.reset({
        studyId: id ?? '',
        recordNumber: recordNumber ?? "",
        registrationNumber: registrationNumber ?? "",
        dateOfRegistration: formatToDDMMYYYY(dateOfRegistration) ?? "",
        scientificTitle: response.data.scientificTitle ?? "",
        publicTitleEn: response.data.publicTitleEn ?? "",
        publicTitleAr: response.data.publicTitleAr ?? "",
        acronym: response.data.acronym ?? "",
        secondaryIdentifyingNumbers: response.data.secondaryIdentifyingNumbers ?? "",
      })
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";

      toast.error(errorMessage);
    }
  }


  const onSaveDraft = async () => {
    try {
      const raw = form.getValues();
      const payload = { ...raw, isDraft: true };

      const response = await saveStudyBrief(payload).unwrap();
      toast.success(response?.message ?? "Draft saved");

    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ??
        (error as { message?: string })?.message ??
        "Something went wrong";

      toast.error(errorMessage);
    }
  };



  const onSubmit = async (data: StudyBriefValues) => {
    try {
      const response = await saveStudyBrief({ ...data, isDraft: false }).unwrap();
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
    if (navigationDirection === 'back' || navigationDirection === 'initial') {
      GetStudyBrief();
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
            Title & additional Identifiers
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
                    <FormInput name="recordNumber" label="Record Number" type="text" placeholder="" disabled />
                    <FormInput name="registrationNumber" label="SCTR Registration Number" type="text" placeholder="" disabled />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <FormInput name="dateOfRegistration" label="Date of registration in SCTR" type="text" placeholder="" disabled />
                    <FormInput name="scientificTitle" label="Scientific Title" type="text" placeholder="" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <FormInput name="publicTitleEn" label="Public Title (English)" type="text" placeholder="" />
                    <FormInput name="publicTitleAr" label="Public Title (Arabic)" type="text" placeholder="" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <FormInput name="acronym" label="Acronym" type="text" placeholder="" />
                    <FormInput name="secondaryIdentifyingNumbers" label="Secondary Identifying Numbers" type="text" placeholder="" />
                  </div>
                </div>

                <div className='mt-auto pt-6 flex justify-end'>
                  <Button type="submit" className="w-1/3 py-6" isLoading={isLoading} >
                    Next
                  </Button>
                </div>
              </form>
            </Form>
          </FormProvider>
        )}

      </motion.div>
    </AnimatePresence>

  )
}

export default StudyBriefForm