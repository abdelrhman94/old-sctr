import { FormInput } from '@/components/shared/FormInput'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useLazyGetPlainSummaryQuery, useSavePlainSummaryMutation } from '@/store/api/studiesApi'
import { nextCreateStudyStep, prevCreateStudyStep } from '@/store/slices/createStudyStepsSlice'
import { PlainSummarySchema } from '@/utils/validationSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, Loader2 } from 'lucide-react'
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

export type PlainSummaryValues = z.infer<typeof PlainSummarySchema>;
const PlainSummaryForm = ({ navigationDirection, setNavigationDirection }: Props) => {
  const dispatch = useDispatch()
  const [id] = useQueryState("id");

  const [savePlainSummary, { isLoading }] = useSavePlainSummaryMutation();
  const [getPlainSummary, { isFetching }] = useLazyGetPlainSummaryQuery();



  const GetPlainSummary = async () => {
    try {
      const studyId = id ?? '';
      const response = await getPlainSummary(studyId).unwrap();
      form.reset({
        studyId: id ?? '',
        plainSummaryAr: response.data.plainSummaryAr ?? "",
        plainSummaryEn: response.data.plainSummaryEn ?? "",
        keywords: response.data.keywords ?? "",
      })
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }
  }


  const form = useForm<PlainSummaryValues>({
    resolver: zodResolver(PlainSummarySchema),
    defaultValues: {
      studyId: id ?? '',
      plainSummaryAr: "",
      plainSummaryEn: "",
      keywords: "",
    },
  })

  const onSaveDraft = async () => {
    try {
      const raw = form.getValues();
      const payload = { ...raw, isDraft: true };

      const response = await savePlainSummary(payload).unwrap();
      toast.success(response?.message ?? "Draft saved");

    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ??
        (error as { message?: string })?.message ??
        "Something went wrong";

      toast.error(errorMessage);
    }
  };

  const onSubmit = async (data: PlainSummaryValues) => {
    try {
      const response = await savePlainSummary({ ...data, isDraft: false }).unwrap();
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

      GetPlainSummary();
    }
  }, [navigationDirection]);

  return (

    <AnimatePresence mode="wait">
      <motion.div
        key="plainSummary"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.3 }}
        className=""
      >
        <div className="grid grid-cols-4 items-center">
          <h2 className="col-span-2 col-start-2 text-secondary font-medium text-3xl my-1 text-center">Plain Summary</h2>
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
        ) : (<FormProvider {...form}>
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col min-h-[400px]">
              <div className="flex-grow space-y-8 my-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <FormInput name="plainSummaryEn" label="Plain Summary (English)" type="textarea" placeholder="" style='h-28' />
                  <FormInput name="plainSummaryAr" label="Plain Summary (Arabic)" type="textarea" placeholder="" style='h-28' />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <FormInput name="keywords" label="Keywords" type="text" placeholder="" />

                </div>
              </div>


              <div className='mt-auto pt-6 flex justify-end'>
                <Button type="submit" className="w-1/3 py-6" disabled={isLoading}>
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>)}

      </motion.div>
    </AnimatePresence>

  )
}

export default PlainSummaryForm