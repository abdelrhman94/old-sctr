import { AsyncFormSelect } from '@/components/shared/FormAsyncSelect';
import FormBooleanSelect from '@/components/shared/FormBooleanSelect';
import { FormInput } from '@/components/shared/FormInput';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Lookups } from '@/models/lookups.model';
import { useLazyGetCitiesLookupsQuery, useLazyGetCountriesLookupsQuery, useLazyGetRegionsLookupsQuery } from '@/store/api/lookups.Api';
import { useLazyGetSponsorsQuery, useSaveSponsorsMutation } from '@/store/api/studiesApi';
import { nextCreateStudyStep } from '@/store/slices/createStudyStepsSlice';
import { PaginationResponse } from '@/utils/makeLookupLoader';
import { SponsorsSchema } from '@/utils/validationSchema';

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

export type SponsorValues = z.infer<typeof SponsorsSchema>;
const SponsorsForm = ({ navigationDirection }: Props) => {
  const dispatch = useDispatch()
  const [id] = useQueryState("id");
  const [saveSponsors, { isLoading }] = useSaveSponsorsMutation();
  const [getSponsors, { isFetching }] = useLazyGetSponsorsQuery();

  const form = useForm({
    resolver: zodResolver(SponsorsSchema),
    defaultValues: {
      studyId: id ?? '',
      isThereAnySponsors: undefined,
      sponsorName: "",
      sponsorCountry: undefined,
      sponsorRegion: undefined,
      sponsorCity: undefined,
      sponsorPostcode: undefined,
      sponsorPhone: "",
      sponsorWebsite: "",
      sponsorDesignation: "",
      publicPhone: "",
      publicEmail: "",
      scientificPhone: "",
      scientificEmail: "",
    },
  })

  const GetSponsors = async () => {
    try {
      const studyId = id ?? '';
      const response = await getSponsors(studyId).unwrap();
      form.reset({
        studyId: id ?? '',
        isThereAnySponsors: response.data.isThereAnySponsors ?? undefined,
        sponsorName: response.data.sponsorName ?? "",
        sponsorCountry: response.data.sponsorCountry ?? undefined,
        sponsorRegion: response.data.sponsorRegion ?? undefined,
        sponsorCity: response.data.sponsorCity ?? undefined,
        sponsorPostcode: response.data.sponsorPostcode ?? undefined,
        sponsorPhone: response.data.sponsorPhone ?? "",
        sponsorWebsite: response.data.sponsorWebsite ?? "",
        sponsorDesignation: response.data.sponsorDesignation ?? "",
        publicPhone: response.data.publicPhone ?? "",
        publicEmail: response.data.publicEmail ?? "",
        scientificPhone: response.data.scientificPhone ?? "",
        scientificEmail: response.data.scientificEmail ?? "",
      });
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }
  }

  const hasSponsors = form.watch('isThereAnySponsors');

  useEffect(() => {
    if (!hasSponsors) {
      form.resetField("sponsorName");
      form.resetField("sponsorCountry");
      form.resetField("sponsorRegion");
      form.resetField("sponsorCity");
      form.resetField("sponsorPostcode");
      form.resetField("sponsorPhone");
      form.resetField("sponsorWebsite");
      form.resetField("sponsorDesignation");
      form.resetField("publicPhone");
      form.resetField("publicEmail");
      form.resetField("scientificPhone");
      form.resetField("scientificEmail");
    }
  }, [hasSponsors, form]);



  const onSaveDraft = async () => {
    try {
      const raw = form.getValues();
      const payload = { ...raw, isDraft: true };
      const response = await saveSponsors(payload).unwrap();
      toast.success(response?.message ?? "Draft saved");
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ??
        (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }
  };
  const onSubmit = async (data: SponsorValues) => {
    try {
      const payload = { ...data, isDraft: false };
      const response = await saveSponsors(payload).unwrap();
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
      GetSponsors();
    }
  }, [navigationDirection]);

  const selectedCountryId: number | undefined = form.watch('sponsorCountry');
  const selectedRegionId: number | undefined = form.watch('sponsorRegion');

  useEffect(() => {
    form.setValue('sponsorRegion', 0, { shouldDirty: true });
  }, [selectedCountryId]);

  useEffect(() => {
    form.setValue('sponsorCity', 0, { shouldDirty: true });
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
            Sponsors
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
                      name="isThereAnySponsors"
                      label="Is there any sponsors for the study?"
                    />
                  </div>
                  <AnimatePresence initial={false}>
                    {hasSponsors && (
                      <motion.div
                        key="sponsor-fields"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-8"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                          <FormInput name="sponsorName" label="Sponsor Name" type="text" placeholder="" />
                          <AsyncFormSelect
                            name="sponsorCountry"
                            label="Sponsor Country"
                            placeholder="Search Country…"
                            loadPage={loadCountries}
                            valueType="number"
                            defaultOptions
                            cacheUniqs={[]}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                          <AsyncFormSelect
                            name="sponsorRegion"
                            label="Sponsor Region"
                            placeholder={!selectedCountryId ? 'Select a country first…' : 'Search regions…'}
                            loadPage={loadRegions}
                            valueType="number"
                            disabled={!selectedCountryId}
                            defaultOptions={!!selectedCountryId}
                            cacheUniqs={[selectedCountryId]}
                          />
                          <AsyncFormSelect
                            name="sponsorCity"
                            label="Sponsor City"
                            placeholder={!selectedRegionId ? 'Select a region first…' : 'Search cities…'}
                            loadPage={loadCities}
                            valueType="number"
                            disabled={!selectedRegionId}
                            defaultOptions={!!selectedRegionId}
                            cacheUniqs={[selectedRegionId]}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                          <FormInput name="sponsorPostcode" label="Sponsor Postcode" type="number" placeholder="" />
                          <FormInput name="sponsorPhone" label="Sponsor Phone" type="text" placeholder="" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                          <FormInput name="sponsorWebsite" label="Sponsor Website" type="text" placeholder="" />
                          <FormInput name="sponsorDesignation" label="Sponsor Designation" type="text" placeholder="" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                          <FormInput name="publicPhone" label="Public Phone" type="text" placeholder="" />
                          <FormInput name="publicEmail" label="Public Email" type="email" placeholder="" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                          <FormInput name="scientificPhone" label="Scientific Phone" type="text" placeholder="" />
                          <FormInput name="scientificEmail" label="Scientific Email" type="email" placeholder="" />
                        </div>
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

export default SponsorsForm