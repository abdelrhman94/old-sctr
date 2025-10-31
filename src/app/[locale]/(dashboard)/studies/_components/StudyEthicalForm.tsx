import FormDatePicker from '@/components/shared/FormDatePicker';
import { FormInput } from '@/components/shared/FormInput';
import { FormSelect } from '@/components/shared/FormSelect';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ethicalApprovalOptions, EthicalApprovalStatus } from '@/enums/enums';
import { useLazyGetEthicalApprovalQuery, useSaveEthicalApprovalMutation, useUploadEthicalAttachmentMutation } from '@/store/api/studiesApi';
import { nextCreateStudyStep } from '@/store/slices/createStudyStepsSlice';
import { EthicalApprovalFormSchema } from '@/utils/validationSchema';
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

export type EthicalApprovalValues = z.infer<typeof EthicalApprovalFormSchema>;
const StudyEthicalForm = ({ totalSteps, navigationDirection, setNavigationDirection }: Props) => {

  const dispatch = useDispatch()
  const [id] = useQueryState("id");

  const [saveEthicalApproval, { isLoading }] = useSaveEthicalApprovalMutation();
  const [getEthicalApproval, { isFetching }] = useLazyGetEthicalApprovalQuery();
  const [uploadEthicalAttachment, { isLoading: isUploading }] = useUploadEthicalAttachmentMutation();

  const GetEthicalApproval = async () => {

    try {
      const studyId = id ?? '';
      const response = await getEthicalApproval(studyId).unwrap();
      form.reset({
        studyId: id ?? '',
        ethicalApprovalStatus: response.data.ethicalApprovalStatus ?? 0,
        dateOfSubmission: response.data.dateOfSubmission ?? undefined,
        dateOfApproval: response.data.dateOfApproval ?? undefined,
        ethicsCommettees:
          response.data.ethicsCommettees?.length
            ? response.data.ethicsCommettees
            : [{ name: '', email: '', phone: '' }],
        attachment: undefined,
      })

    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }
  }



  const form = useForm<EthicalApprovalValues>({
    resolver: zodResolver(EthicalApprovalFormSchema),
    defaultValues: {
      studyId: id ?? '',
      ethicalApprovalStatus: 0,
      dateOfSubmission: undefined,
      dateOfApproval: undefined,
      ethicsCommettees: [{ name: '', email: '', phone: '' }],
      attachment: undefined,
    },
  })


  const status = form.watch('ethicalApprovalStatus');
  const isApproved = status === EthicalApprovalStatus.Approved;

  useEffect(() => {
    if (!isApproved) {
      form.setValue('attachment', undefined, { shouldDirty: true });
    }
  }, [isApproved]);

  const onSaveDraft = async () => {
    try {
      const raw = form.getValues();
      const payload = { ...raw, isDraft: true };
      const response = await saveEthicalApproval(payload).unwrap();
      toast.success(response?.message ?? "Draft saved");
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ??
        (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }
  };
  const onSubmit = async (data: EthicalApprovalValues) => {
    try {

      const response = await saveEthicalApproval({ ...data, isDraft: false }).unwrap();
      if (isApproved && data.attachment) {
        await uploadEthicalAttachment({
          studyId: data.studyId,
          file: data.attachment,
        }).unwrap();

      }
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
        key="study-ethical-approval"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.3 }}
        className=""
      >
        <div className="grid grid-cols-4 items-center">
          <h2 className="col-span-2 col-start-2 text-secondary font-medium text-3xl my-1 text-center">
            Study Ethical Approval
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
                    name="ethicalApprovalStatus"
                    label="Ethical Approval Status"
                    placeholder='Select…'
                    valueType="number"
                    options={ethicalApprovalOptions}
                  />
                  <FormInput key={isApproved ? 'file-enabled' : 'file-disabled'}
                    name="attachment"
                    label="Ethical Approval Attachment"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    disabled={!isApproved} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <FormDatePicker
                    placeholder=""
                    name="dateOfSubmission"
                    label="Date of Submission"
                    minDate={new Date(2000, 0, 1)}
                    maxDate={new Date()}
                    displayFormat="dd/MM/yyyy"
                  />
                  <FormDatePicker
                    placeholder=""
                    name="dateOfApproval"
                    label="Date of Approval"
                    minDate={new Date(2000, 0, 1)}
                    maxDate={new Date()}
                    displayFormat="dd/MM/yyyy"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                  <FormInput name="ethicsCommettees[0].name" label="Name of ethics committee" type="text" placeholder="" />
                  <FormInput name="ethicsCommettees[0].phone" label="Phone of ethical committee" type="text" placeholder="" />
                  <FormInput name="ethicsCommettees[0].email" label="Email of ethical committee" type="text" placeholder="" />
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

export default StudyEthicalForm