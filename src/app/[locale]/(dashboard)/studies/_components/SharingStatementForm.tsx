
import { FormChecklist } from '@/components/shared/FormChecklist';
import { FormInput } from '@/components/shared/FormInput';
import { FormSelect } from '@/components/shared/FormSelect';
import ResponseStatusComponent from '@/components/shared/ResponseStatusComponent';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useGetLookupByNameQuery } from '@/store/api/lookups.Api';
import { useLazyGetIPDQuery, useSaveIPDMutation, useSubmitStudyMutation } from '@/store/api/studiesApi';
import { SaveIPDSchema } from '@/utils/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import type { z } from "zod";


type Props = {
  totalSteps: number;
  navigationDirection: 'forward' | 'back' | 'initial';
  setNavigationDirection: (state: 'forward' | 'back' | 'initial') => void
}

type SaveIPDForm = z.infer<typeof SaveIPDSchema>;
const SharingStatementForm = ({ navigationDirection, setNavigationDirection }: Props) => {
  const dispatch = useDispatch()
  const [id] = useQueryState("id");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [saveIPD, { isLoading }] = useSaveIPDMutation();
  const [getIPD, { isFetching }] = useLazyGetIPDQuery();
  const [submitStudy, { isLoading: isSubmitting }] = useSubmitStudyMutation();
  const { data: planToShareLookup, isLoading: planToShareLoading } = useGetLookupByNameQuery({ name: 'EnumPlanToShareIpd' });
  const { data: supportingLookup, isLoading: supportingLoading } = useGetLookupByNameQuery({ name: 'EnumSupportingInfos' });

  const form = useForm({
    resolver: zodResolver(SaveIPDSchema),
    defaultValues: {
      studyId: id ?? "",
      isIndividualParticipantsDataShared: undefined,
      shareType: [],
      ipdSharingPlanDescription: "",
      trialWebsite: "",
    },
  })


  const GetIPD = async () => {
    try {
      const studyId = id ?? '';
      const response = await getIPD(studyId).unwrap();
      form.reset({
        studyId: id ?? '',
        isIndividualParticipantsDataShared: response.data.isIndividualParticipantsDataShared,
        shareType: response.data.shareType,
        ipdSharingPlanDescription: response.data.ipdSharingPlanDescription,
        trialWebsite: response.data.trialWebsite
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
      const response = await saveIPD(payload).unwrap();
      toast.success(response?.message ?? "Draft saved");
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ??
        (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }
  };
  const onSubmit = async (data: SaveIPDForm) => {
    try {
      const response = await saveIPD({ ...data, isDraft: false }).unwrap();
      toast.success(response?.message);
      const submitResponse = await submitStudy(data.studyId).unwrap();
      setSubmittedSuccess(true);
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ??
        (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }
  };


  useEffect(() => {
    if (navigationDirection === 'back') {

      GetIPD();
    }
  }, [navigationDirection]);

  const planToShareStatus = form.watch('isIndividualParticipantsDataShared');

  if (submittedSuccess) {
    return (
      <ResponseStatusComponent
        btnName="Done"
        routeLink="/studies"
        status="success"
        title="Study has been submitted successfully"
        description="Our team will be reviewing your study shortly."
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="ipd-sharing-statement"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.3 }}
        className=""
      >
        <div className="grid grid-cols-4 items-center">
          <h2 className="col-span-2 col-start-2 text-secondary font-medium text-3xl my-1 text-center">IPD sharing statement </h2>
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
                      name="isIndividualParticipantsDataShared"
                      label="Plan to share individual participants data (IPD)"
                      placeholder='Select…'
                      valueType="number"
                      readingId
                      loading={planToShareLoading}
                      options={planToShareLookup?.data?.EnumPlanToShareIpd || []}
                    />
                  </div>
                  {planToShareStatus === 1 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                        <FormInput
                          name="ipdSharingPlanDescription"
                          label="Study IPD sharing plan description"
                          type="text"
                        />
                        <FormChecklist
                          name="shareType"
                          label="IPD Sharing Supporting Information Type"
                          options={supportingLookup?.data?.EnumSupportingInfos || []}
                          readingId
                          valueType="number"
                          loading={supportingLoading}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                        <FormInput
                          name="trialWebsite"
                          label="Trial website"
                          type="text"
                        />
                      </div>
                    </>
                  )}

                </div>
                <div className='mt-auto pt-6 flex justify-end'>
                  <Button type="submit" className="w-1/3 py-6" isLoading={isLoading || isSubmitting} >
                    Submit
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

export default SharingStatementForm