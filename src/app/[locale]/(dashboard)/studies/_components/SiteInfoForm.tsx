import { AsyncFormSelect } from '@/components/shared/FormAsyncSelect'
import { FormInput } from '@/components/shared/FormInput'
import { FormSelect } from '@/components/shared/FormSelect'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { siteRequirementsOptions } from '@/enums/enums'
import { Lookups } from '@/models/lookups.model'
import { PaginationResponse } from '@/models/Response.model'
import { useLazyGetCitiesLookupsQuery, useLazyGetRegionsLookupsQuery } from '@/store/api/lookups.Api'
import { useLazyGetSiteInformationQuery, useSaveSiteInformationMutation } from '@/store/api/studiesApi'
import { nextCreateStudyStep } from '@/store/slices/createStudyStepsSlice'
import { SiteInfoSchema } from '@/utils/validationSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { useQueryState } from 'nuqs'
import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { z } from "zod"


type Props = {
  totalSteps: number;
  navigationDirection: 'forward' | 'back' | 'initial';
  setNavigationDirection: (state: 'forward' | 'back' | 'initial') => void
}

export type SiteInfoValues = z.infer<typeof SiteInfoSchema>;
const SiteInfoForm = ({ totalSteps, navigationDirection, setNavigationDirection }: Props) => {
  const dispatch = useDispatch()
  const [id] = useQueryState("id");

  const [saveSiteInformation, { isLoading }] = useSaveSiteInformationMutation();
  const [getSiteInformation, { isFetching }] = useLazyGetSiteInformationQuery();


  const GetSiteInformation = async () => {
    try {
      const studyId = id ?? '';
      const response = await getSiteInformation(studyId).unwrap();
      form.reset({
        studyId: id ?? '',
        cities: response.data.cities ?? "",
        regions: response.data.regions ?? "",
        siteNameAr: response.data.siteNameAr ?? "",
        siteNameEn: response.data.siteNameEn ?? "",
        piTitle: response.data.piTitle ?? "",
        piFirstNme: response.data.piFirstNme ?? "",
        piFamilyNme: response.data.piFamilyNme ?? "",
        piCity: response.data.piCity ?? "",
        piRegion: response.data.piRegion ?? "",
        piContactForScientific: response.data.piContactForScientific ?? { fullName: '', phoneNumber: '', email: '' },
        piContactForPublic: response.data.piContactForPublic ?? { fullName: response.data.piContactForPublic, phoneNumber: '', email: '' },
        publicContact: response.data.publicContact ?? { fullName: '', phoneNumber: '', email: '' },
        scientificContact: response.data.scientificContact ?? { fullName: '', phoneNumber: '', email: '' },
        siteRequirementsStatus: response.data.siteRequirementsStatus ?? 0
      })
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }
  }



  const form = useForm<SiteInfoValues>({
    resolver: zodResolver(SiteInfoSchema),
    defaultValues: {
      studyId: id ?? '',
      regions: undefined,
      cities: undefined,
      siteNameAr: '',
      siteNameEn: '',
      piTitle: '',
      piFirstNme: '',
      piFamilyNme: '',
      piRegion: undefined,
      piCity: undefined,
      piContactForScientific: { fullName: '', phoneNumber: '', email: '' },
      piContactForPublic: { fullName: '', phoneNumber: '', email: '' },
      publicContact: { fullName: '', phoneNumber: '', email: '' },
      scientificContact: { fullName: '', phoneNumber: '', email: '' },
      siteRequirementsStatus: 0,
    },
  })



  const selectedRegionId: number | undefined = form.watch('regions');
  const selectedPiRegionId: number | undefined = form.watch('piRegion');


  useEffect(() => {
    form.setValue('cities', 0, { shouldDirty: true });
  }, [selectedRegionId]);

  useEffect(() => {
    form.setValue('piCity', 0, { shouldDirty: true });
  }, [selectedPiRegionId]);


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

  function createCitiesLoader(getRegionId: () => number | undefined) {
    return async (search: string, page: number): Promise<PaginationResponse<Lookups>> => {
      const regionId = getRegionId();

      if (!regionId) {
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
        parentId: regionId,
        pageNumber: page,
        pageSize: 10,
        search,
      }).unwrap();

      return {
        ...result,
        data: result.data.map(c => ({
          id: c.id,
          parentId: c.parentId,
          totalCount: c.totalCount,
          label: c.label,
          value: c.id,
        })),
      };
    };
  }

  // Site cities depend on form field `regions`
  const loadSiteCities = useMemo(
    () => createCitiesLoader(() => form.getValues('regions')),
    [triggerCities, form]
  );

  // PI cities depend on form field `piRegion`
  const loadPiCities = useMemo(
    () => createCitiesLoader(() => form.getValues('piRegion')),
    [triggerCities, form]
  );






  const onSaveDraft = async () => {
    try {
      const raw = form.getValues();
      const payload = { ...raw, isDraft: true };

      const response = await saveSiteInformation(payload).unwrap();
      toast.success(response?.message ?? "Draft saved");

    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ??
        (error as { message?: string })?.message ??
        "Something went wrong";

      toast.error(errorMessage);
    }
  };

  const onSubmit = async (data: SiteInfoValues) => {
    try {
      const response = await saveSiteInformation({ ...data, isDraft: false }).unwrap();
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

      GetSiteInformation();
    }
  }, [navigationDirection]);

  return (

    <AnimatePresence mode="wait">
      <motion.div
        key="site-info"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.3 }}
        className=""
      >
        <div className="grid grid-cols-4 items-center">
          <h2 className="col-span-2 col-start-2 text-secondary font-medium text-3xl my-1 text-center">Site Information</h2>
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
        <FormProvider {...form}>
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 my-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <AsyncFormSelect
                  name="regions"
                  label="Region"
                  placeholder="Search Region…"
                  loadPage={loadRegions}
                  valueType="number"
                  defaultOptions
                  cacheUniqs={[]}
                />
                <AsyncFormSelect
                  name="cities"
                  label="City"
                  placeholder={!selectedRegionId ? 'Select a region first…' : 'Search cities…'}
                  loadPage={loadSiteCities}
                  valueType="number"
                  disabled={!selectedRegionId}
                  defaultOptions={!!selectedRegionId}
                  cacheUniqs={[selectedRegionId]}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <FormInput name="siteNameEn" label="Site Name (English)" type="text" placeholder="" />
                <FormInput name="siteNameAr" label="Site Name (Arabic)" type="text" placeholder="" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <FormSelect
                  name="piTitle"
                  label="PI Title"
                  placeholder='Select…'
                  valueType="string"
                  options={[
                    { label: "Dr", value: "Dr" },
                    { label: "Prof", value: "Prof" },

                  ]}
                />
                <FormInput name="piFirstNme" label="PI First Name" type="text" placeholder="" />

              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <FormInput name="piFamilyNme" label="PI Family Name" type="text" placeholder="" />

                <AsyncFormSelect
                  name="piRegion"
                  label="PI Region"
                  placeholder="Search Region…"
                  loadPage={loadRegions}
                  valueType="number"
                  defaultOptions
                  cacheUniqs={[]}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <AsyncFormSelect
                  name="piCity"
                  label="PI City"
                  placeholder={!selectedPiRegionId ? 'Select a region first…' : 'Search regions…'}
                  loadPage={loadPiCities}
                  valueType="number"
                  disabled={!selectedPiRegionId}
                  defaultOptions={!!selectedPiRegionId}
                  cacheUniqs={['pi-cities', selectedPiRegionId]}
                />
                <FormInput name="piContactForScientific.fullName" label="PI Scientific Contact - Full Name" type="text" placeholder="" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <FormInput name="piContactForScientific.phoneNumber" label="PI Scientific Contact - Phone" type="text" placeholder="" />
                <FormInput name="piContactForScientific.email" label="PI Scientific Contact - Email" type="text" placeholder="" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <FormInput name="piContactForPublic.fullName" label="PI Contact - Full Name" type="text" placeholder="" />
                <FormInput name="piContactForPublic.phoneNumber" label="PI Contact - Phone" type="text" placeholder="" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <FormInput name="piContactForPublic.email" label="PI Contact - Email" type="text" placeholder="" />
                <FormInput name="publicContact.fullName" label="Public Contact - Full Name" type="text" placeholder="" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <FormInput name="publicContact.phoneNumber" label="Public Contact - Phone" type="text" placeholder="" />
                <FormInput name="publicContact.email" label="Public Contact - Email" type="text" placeholder="" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <FormInput name="scientificContact.fullName" label="PI Contact - Full Name" type="text" placeholder="" />
                <FormInput name="scientificContact.phoneNumber" label="PI Contact - Phone" type="text" placeholder="" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <FormInput name="scientificContact.email" label="Scientific Contact - Email" type="text" placeholder="" />
                <FormSelect
                  name="siteRequirementsStatus"
                  label="Site Recruitment Status"
                  placeholder='Select…'
                  valueType="number"
                  options={siteRequirementsOptions}
                />

              </div>

              <div className='mt-auto pt-6 flex justify-end'>
                <Button type="submit" className="w-1/3 py-6" disabled={isLoading}>
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>
      </motion.div>
    </AnimatePresence>

  )
}

export default SiteInfoForm