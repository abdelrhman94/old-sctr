import { FormChecklist } from '@/components/shared/FormChecklist';
import { FormInput } from '@/components/shared/FormInput';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useGetLookupByNameQuery } from '@/store/api/lookups.Api';
import { useLazyGetFundersQuery, useSaveFundersMutation } from '@/store/api/studiesApi';
import { nextCreateStudyStep } from '@/store/slices/createStudyStepsSlice';
import { FoundersSchema } from '@/utils/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import type { z } from "zod";

type Props = {
  totalSteps: number;
  navigationDirection: 'forward' | 'back' | 'initial';
  setNavigationDirection: (state: 'forward' | 'back' | 'initial') => void
}
type FoundersForm = z.infer<typeof FoundersSchema>;
const FoundersForm = ({ navigationDirection, setNavigationDirection }: Props) => {
  const dispatch = useDispatch()
  const [id] = useQueryState("id");
  const [saveFunders, { isLoading }] = useSaveFundersMutation();
  const [getFunders, { isFetching }] = useLazyGetFundersQuery();
  const { data: fundingSourceLookup, isLoading: fundingSourceLoading } = useGetLookupByNameQuery({ name: 'EnumFundingSource' });
  const { data: aidTypeLookup, isLoading: aidTypeLoading } = useGetLookupByNameQuery({ name: 'EnumAidType' });

  const form = useForm({
    resolver: zodResolver(FoundersSchema),
    defaultValues: {
      studyId: id ?? "",
      sources: [],
      sourceText: "",
      type: [],
      typeText: "",
    },
  })
  const GetFunders = async () => {
    try {
      const studyId = id ?? '';
      const response = await getFunders(studyId).unwrap();
      form.reset({
        studyId: id ?? '',
        sources: response.data.sources ?? [],
        sourceText: response.data.sourceText ?? "",
        type: response.data.type ?? [],
        typeText: response.data.typeText ?? "",
      })
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ??
        (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }
  }
  const onSaveDraft = async () => {
    try {
      const raw = form.getValues();
      const payload = { ...raw, isDraft: true };
      const response = await saveFunders(payload).unwrap();
      toast.success(response?.message ?? "Draft saved");
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ??
        (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }
  };
  const onSubmit = async (data: FoundersForm) => {
    try {
      const response = await saveFunders({ ...data, isDraft: false }).unwrap();
      dispatch(nextCreateStudyStep())
      toast.success(response?.message);
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ??
        (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }
  };

  const otherSources = form.watch('sources');
  const otherTypes = form.watch('type');

  useEffect(() => {
    if (navigationDirection === 'back') {

      GetFunders();
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
            Founders
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
                  <div className="flex-grow my-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                      {/* Column 1: Major source + conditional text */}
                      <div className="space-y-4">
                        <FormChecklist
                          name="sources"
                          label="Major source"
                          options={fundingSourceLookup?.data?.EnumFundingSource || []}
                          readingId
                          valueType="number"
                          loading={fundingSourceLoading}
                        />
                        {otherSources?.includes(6) && (
                          <FormInput
                            name="sourceText"
                            label="Other Funding Source"
                            type="text"
                          />
                        )}
                      </div>

                      {/* Column 2: Type of aid + conditional text */}
                      <div className="space-y-4">
                        <FormChecklist
                          name="type"
                          label="Type of aid"
                          options={aidTypeLookup?.data?.EnumAidType || []}
                          readingId
                          valueType="number"
                          loading={aidTypeLoading}
                        />
                        {otherTypes?.includes(3) && (
                          <FormInput
                            name="typeText"
                            label="Other Aid Type"
                            type="text"
                          />
                        )}
                      </div>
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
    </AnimatePresence >
  )
}

export default FoundersForm