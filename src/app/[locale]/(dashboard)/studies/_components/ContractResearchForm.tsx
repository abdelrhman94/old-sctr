import { AsyncFormSelect } from '@/components/shared/FormAsyncSelect';
import FormBooleanSelect from '@/components/shared/FormBooleanSelect';
import { FormInput } from '@/components/shared/FormInput';
import { FormSelect } from '@/components/shared/FormSelect';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Lookups } from '@/models/lookups.model';
import { useGetLookupByNameQuery, useLazyGetCitiesLookupsQuery, useLazyGetCountriesLookupsQuery, useLazyGetRegionsLookupsQuery } from '@/store/api/lookups.Api';
import { useLazyGetCroQuery, useSaveCroMutation } from '@/store/api/studiesApi';
import { nextCreateStudyStep } from '@/store/slices/createStudyStepsSlice';
import { PaginationResponse } from '@/utils/makeLookupLoader';
import { ContractResearchSchema } from '@/utils/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { z } from "zod";

type Props = {
  totalSteps: number;
  navigationDirection: 'forward' | 'back' | 'initial';
  setNavigationDirection: (state: 'forward' | 'back' | 'initial') => void
}

export type ContractResearchValues = z.infer<typeof ContractResearchSchema>;
const ContractResearchForm = ({ navigationDirection }: Props) => {
  const dispatch = useDispatch()
  const [id] = useQueryState("id");
  const [saveCro, { isLoading }] = useSaveCroMutation();
  const [getCro, { isFetching }] = useLazyGetCroQuery();
  const { data: croRoleLookup, isLoading: croRoleLoading } = useGetLookupByNameQuery({ name: 'EnumCroRole' });


  const form = useForm({
    resolver: zodResolver(ContractResearchSchema),
    defaultValues: {
      studyId: id ?? '',
      isThereAnyCRO: undefined,
      name: '',
      country: undefined,
      region: undefined,
      city: undefined,
      postcode: undefined,
      tel: '',
      croWebsite: '',
      roleOrServices: undefined,
      otherRoleOrServices: '',
    },
  })

  const GetCro = async () => {
    try {
      const studyId = id ?? '';
      const response = await getCro(studyId).unwrap();
      form.reset({
        studyId: id ?? '',
        isThereAnyCRO: response.data.isThereAnyCRO ?? undefined,
        name: response.data.name ?? "",
        country: response.data.country ?? undefined,
        region: response.data.region ?? undefined,
        city: response.data.city ?? undefined,
        postcode: response.data.postcode ?? undefined,
        tel: response.data.tel ?? "",
        croWebsite: response.data.croWebsite ?? "",
        roleOrServices: response.data.roleOrServices ?? undefined,
        otherRoleOrServices: response.data.otherRoleOrServices ?? "",
      });
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }
  }



  const hasCro = form.watch('isThereAnyCRO');
  const otherRoleOrServices = form.watch('roleOrServices');

  const selectedCountryId: number | undefined = form.watch('country');
  const selectedRegionId: number | undefined = form.watch('region');



  useEffect(() => {
    form.setValue('region', undefined, { shouldDirty: true });
  }, [selectedCountryId]);

  useEffect(() => {
    form.setValue('city', undefined, { shouldDirty: true });
  }, [selectedRegionId]);

  const [triggerCountries] = useLazyGetCountriesLookupsQuery();
  const [triggerRegions] = useLazyGetRegionsLookupsQuery();
  const [triggerCities] = useLazyGetCitiesLookupsQuery();




  const loadCountries = useMemo(
    () =>
      async (search: string, page: number): Promise<PaginationResponse<Lookups>> => {
        const result = await triggerCountries({
          pageNumber: page,
          pageSize: 10,
          parentId: 1,
          search,
        }).unwrap();

        return {
          ...result,
          data: result.data.map((country) => ({
            id: country.id,
            parentId: country.parentId,
            totalCount: country.totalCount,
            label: country.label,
            value: country.id,
          })),
        };
      },
    [triggerCountries]
  );

  const loadRegions = useMemo(
    () =>
      async (search: string, page: number): Promise<PaginationResponse<Lookups>> => {
        if (!selectedCountryId) {
          return {
            code: 200,
            message: 'No country selected',
            data: [],
            totalRowsCount: 0,
            pageNumber: 1,
            pageSize: 10,
            currentPage: 1,
            numberOfPages: 1,
          };
        }
        const result = await triggerRegions({
          parentId: selectedCountryId,
          pageNumber: page,
          pageSize: 10,
          search,
        }).unwrap();

        return {
          ...result,
          data: result.data.map((region) => ({
            id: region.id,
            parentId: region.parentId,
            totalCount: region.totalCount,
            label: region.label,
            value: region.id,
          })),
        };
      },
    [triggerRegions, selectedCountryId]
  );

  const loadCities = useMemo(
    () =>
      async (search: string, page: number): Promise<PaginationResponse<Lookups>> => {
        if (!selectedRegionId) {
          return {
            code: 200,
            message: 'No region selected',
            data: [],
            totalRowsCount: 0,
            pageNumber: 1,
            pageSize: 10,
            currentPage: 1,
            numberOfPages: 1,
          };
        }

        const result = await triggerCities({
          parentId: selectedRegionId,
          pageNumber: page,
          pageSize: 10,
          search,
        }).unwrap();

        return {
          ...result,
          data: result.data.map((city) => ({
            id: city.id,
            parentId: city.parentId,
            totalCount: city.totalCount,
            label: city.label,
            value: city.id,
          })),
        };
      },
    [triggerCities, selectedRegionId]
  );


  const onSaveDraft = async () => {
    try {
      const raw = form.getValues();
      const payload = { ...raw, isDraft: true };
      const response = await saveCro(payload).unwrap();
      toast.success(response?.message ?? "Draft saved");
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ??
        (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }
  };
  const onSubmit = async (data: ContractResearchValues) => {
    try {
      const response = await saveCro({ ...data, isDraft: false }).unwrap();
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

      GetCro();
    }
  }, [navigationDirection]);


  useEffect(() => {
    if (!hasCro) {
      form.resetField("name");
      form.resetField("country");
      form.resetField("region");
      form.resetField("city");
      form.resetField("postcode");
      form.resetField("tel");
      form.resetField("croWebsite");
      form.resetField("roleOrServices");
      form.resetField("otherRoleOrServices");
    }
  })


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
            Contract Research Organization
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
                    <FormBooleanSelect
                      name="isThereAnyCRO"
                      label="Is there any collaboration for this study?"
                    />
                  </div>
                  <AnimatePresence initial={false}>
                    {hasCro && (
                      <motion.div
                        key="cro-fields"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-8"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                          <FormInput name="name" label="Collaboration Name" type="text" placeholder="" />
                          <AsyncFormSelect
                            name="country"
                            label="Country"
                            placeholder="Search Country…"
                            loadPage={loadCountries}
                            valueType="number"
                            defaultOptions
                            cacheUniqs={[]}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                          <AsyncFormSelect
                            name="region"
                            label="Region"
                            placeholder={!selectedCountryId ? 'Select a country first…' : 'Search regions…'}
                            loadPage={loadRegions}
                            valueType="number"
                            disabled={!selectedCountryId}
                            defaultOptions={!!selectedCountryId}
                            cacheUniqs={[selectedCountryId]}
                          />
                          <AsyncFormSelect
                            name="city"
                            label="City"
                            placeholder={!selectedRegionId ? 'Select a region first…' : 'Search cities…'}
                            loadPage={loadCities}
                            valueType="number"
                            disabled={!selectedRegionId}
                            defaultOptions={!!selectedRegionId}
                            cacheUniqs={[selectedRegionId]}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                          <FormInput name="postcode" label="Post Code" type="number" placeholder="" />
                          <FormInput name="tel" label="Mobile Number" type="text" placeholder="" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                          <FormInput name="croWebsite" label="Collaboration Website" type="text" placeholder="" />
                          <FormSelect
                            name="roleOrServices"
                            label="Role or Services"
                            placeholder='Select…'
                            valueType="number"
                            readingId
                            loading={croRoleLoading}
                            options={croRoleLookup?.data?.EnumCroRole || []}
                          />
                        </div>
                        {otherRoleOrServices === 6 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                            <FormInput name="otherRoleOrServices" label="Other Role or Services" type="text" placeholder="" />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
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

export default ContractResearchForm