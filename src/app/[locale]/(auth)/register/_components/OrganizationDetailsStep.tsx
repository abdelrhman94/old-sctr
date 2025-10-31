'use client'
import { AsyncFormSelect } from '@/components/shared/FormAsyncSelect';
import { FormInput } from '@/components/shared/FormInput';
import { FormSelect } from '@/components/shared/FormSelect';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Lookups } from '@/models/lookups.model';
import { PaginationResponse } from '@/models/Response.model';
import { OrgInfoSchema } from '@/schemas/authSchema';
import { useOrgInfoMutation } from '@/store/api/authApi';
import { useGetOrganizationTypeLookupsQuery, useLazyGetCitiesLookupsQuery, useLazyGetOrganizationLookupsQuery, useLazyGetRegionsLookupsQuery } from '@/store/api/lookups.Api';
import { setStep, setTempOrgId } from '@/store/slices/registrationStepsSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { z } from 'zod';



type OrgInfoFormData = z.infer<typeof OrgInfoSchema>;

const OrganizationDetailsStep = () => {
  const dispatch = useDispatch();
  const [namesLocked, setNamesLocked] = useState(false);
  const [orgInfo, { isLoading }] = useOrgInfoMutation();
  const { data: organizationTypeLookup, isLoading: organizationTypeLoading } = useGetOrganizationTypeLookupsQuery({});

  const form = useForm<OrgInfoFormData>({
    resolver: zodResolver(OrgInfoSchema),
    defaultValues: {
      city: undefined,
      organizationType: undefined,
      organizationId: undefined,
      region: undefined,
      organizationCode: "",
      nameAr: "",
      nameEn: "",
      website: "",
    },
  });


  // Watch the region field value
  const selectedRegionId: number | undefined = form.watch('region');
  const selectedCityId: number | undefined = form.watch('city');

  // Reset city when region changes
  useEffect(() => {
    // When region changes, make city empty (undefined), not 0
    form.setValue('city', 0, { shouldDirty: true });
  }, [selectedRegionId]);

  // Reset organization when region changes
  useEffect(() => {
    // When region organization, make organization empty (undefined), not 0
    form.setValue('organizationId', "", { shouldDirty: true });
    form.setValue('nameEn', '', { shouldDirty: true });
    form.setValue('nameAr', '', { shouldDirty: true });
  }, [selectedCityId]);



  const [triggerCities] = useLazyGetCitiesLookupsQuery();
  const [triggerRegions] = useLazyGetRegionsLookupsQuery();
  const [triggerOrganization] = useLazyGetOrganizationLookupsQuery();


  const loadRegions = useMemo(
    () =>
      async (search: string, page: number): Promise<PaginationResponse<Lookups>> => {
        const result = await triggerRegions({
          pageNumber: page,
          pageSize: 10,
          parentId: 1,
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
    [triggerRegions]
  );

  // Loader for Regions (depends on selectedRegionId)
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

  // Loader for Organization (depends on selectedCityId)
  const loadOrganization = useMemo(
    () =>
      async (search: string, page: number): Promise<PaginationResponse<Lookups>> => {
        if (!selectedCityId) {
          return {
            code: 200,
            message: 'No City selected',
            data: [],
            totalRowsCount: 0,
            pageNumber: 1,
            pageSize: 10,
            currentPage: 1,
            numberOfPages: 1,
          };
        }

        const result = await triggerOrganization({
          region: 0,
          city: 0,
          pageNumber: page,
          pageSize: 10,
          search,
        }).unwrap();

        return {
          ...result,
          data: result.data.map((org) => ({
            id: org.id,
            parentId: org.parentId,
            totalCount: org.totalCount,
            label: org.label,
            value: org.id,
            nameAr: org.nameAr,
            nameEn: org.nameEn,
            typeId: org.typeId,
            typeName: org.typeName,
          })),
        };
      },
    [triggerCities, selectedCityId]
  );



  const onSubmit = async (data: OrgInfoFormData) => {
    try {
      const response = await orgInfo(data).unwrap();
      toast.success(response?.message);
      dispatch(setTempOrgId(response.data.id))
      dispatch(setStep(2));
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";

      toast.error(errorMessage);
    }
  };





  return (
    <div className="relative min-h-[300px] mt-5">
      <AnimatePresence mode="wait">
        <motion.div
          key="create_organization"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.3 }}
          className=" w-full"
        >
          <h2 className='text-secondary font-medium text-3xl my-1'>Org. Details</h2>
          <FormProvider {...form}>
            <Form {...form} >
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 my-8">

                <FormSelect
                  name="organizationType"
                  label="Organization Type"
                  placeholder='Select…'
                  valueType="string"
                  readingId
                  loading={organizationTypeLoading}
                  options={organizationTypeLookup?.data || []}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <AsyncFormSelect
                    name="region"
                    label="Region"
                    placeholder="Search Region…"
                    loadPage={loadRegions}
                    valueType="number"
                    defaultOptions
                    cacheUniqs={[]}
                  />
                  <AsyncFormSelect
                    name="city"
                    label="City"
                    placeholder={!selectedRegionId ? 'Select a region first…' : 'Search regions…'}
                    loadPage={loadCities}
                    valueType="number"
                    disabled={!selectedRegionId}
                    defaultOptions={!!selectedRegionId}
                    cacheUniqs={[selectedRegionId]}
                  />
                </div>
                <AsyncFormSelect
                  name="organizationId"
                  label="Organization"
                  placeholder={!selectedCityId ? 'Select a city first…' : 'Search organization'}
                  loadPage={loadOrganization}
                  valueType="string"
                  disabled={!selectedCityId}
                  defaultOptions={!!selectedCityId}
                  cacheUniqs={[selectedCityId]}
                  onSelected={(opt) => {
                    if (opt) {
                      // fill from selected region
                      form.setValue('nameEn', opt.nameEn ?? '', { shouldDirty: true });
                      form.setValue('nameAr', opt.nameAr ?? '', { shouldDirty: true });
                      form.setValue('organizationCode', opt.typeId ?? '', { shouldDirty: true });
                      setNamesLocked(true);
                    } else {
                      // region cleared
                      form.setValue('nameEn', '', { shouldDirty: true });
                      form.setValue('nameAr', '', { shouldDirty: true });
                      setNamesLocked(false);
                    }
                  }}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <FormInput name="nameEn" label="Org. Name ( EN )" type="text" placeholder="" disabled={namesLocked} />
                  <FormInput name="nameAr"   label="Org . Name ( Arabic )" type="text" placeholder="" disabled={namesLocked} />
                </div>
                <FormInput name="website" label="Organisation Wesbite ( URL )" type="text" placeholder="" />

                <Button type="submit" className="w-full py-6" isLoading={isLoading} >
                  Next
                </Button>
              </form>
            </Form>
          </FormProvider>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default OrganizationDetailsStep