'use client'
import { AsyncFormSelect } from '@/components/shared/FormAsyncSelect';
import { FormCheckbox } from '@/components/shared/FormCheckbox';
import { FormInput } from '@/components/shared/FormInput';
import { Lookups } from '@/models/lookups.model';
import { PaginationResponse } from '@/models/Response.model';
import { useLazyGetCitiesLookupsQuery, useLazyGetRegionsLookupsQuery } from '@/store/api/lookups.Api';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';



const PersonalDetailsContinueStep = () => {
  const form = useFormContext();



  // Watch the region field value
  const selectedRegionId: number | undefined = form.watch('region');

  // Reset city when region changes
  useEffect(() => {
    // When region changes, make city empty (undefined), not 0
    form.setValue('city', undefined, { shouldDirty: true });
  }, [selectedRegionId]);

  const [triggerCities] = useLazyGetCitiesLookupsQuery();
  const [triggerRegions] = useLazyGetRegionsLookupsQuery();


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

  // Loader for Regions (depends on selectedCityId)
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








  return (

    <AnimatePresence mode="wait">
      <motion.div
        key="personal_details_continue"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <FormInput name="currentSite" label="Current Site" type="text" placeholder="" />
          <FormInput name="jobTitleText" label="Job Title" type="text" placeholder="" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <FormInput name="department" label="Dep. / Section" type="text" placeholder="" />
          <FormInput name="address1" label="Address" type="text" placeholder="" />
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <FormInput name="postalCode" label="Postal Code" type="text" placeholder="" />
          <FormInput name="mobileNumber" label="Mobile No." type="text" placeholder="" />
        </div>
        <FormCheckbox
          name="termApproved"
          label={<>I agree to all<a className="text-primary" href="/terms" target="_blank">terms & conditions</a></>}
        />

      </motion.div>
    </AnimatePresence>


  )
}

export default PersonalDetailsContinueStep