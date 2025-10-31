import { AsyncFormSelect } from '@/components/shared/FormAsyncSelect';
import { FormInput } from '@/components/shared/FormInput';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { UserType } from '@/enums/enums';
import { Lookups } from '@/models/lookups.model';
import { PaginationResponse } from '@/models/Response.model';
import { userRegisterSchema } from '@/schemas';
import { useRegisterMutation } from '@/store/api/authApi';
import { useLazyGetCitiesLookupsQuery, useLazyGetRegionsLookupsQuery } from '@/store/api/lookups.Api';
import { RootState } from '@/store/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { z } from 'zod';


type UserRegisterFormData = z.infer<typeof userRegisterSchema>;

const RegisterSubUserForm = () => {
  const [register, { isLoading: registerLoading }] = useRegisterMutation();

  const retrieveData = useSelector((state: RootState) => state.registrationData);
  const orgId = useSelector((state: RootState) => state.registration.tempOrgId);

  const form = useForm<UserRegisterFormData>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      idNumber: retrieveData.identityValidation?.idNumber ?? "",
      dateOfBirth: retrieveData.identityValidation?.dob ?? undefined,
      email: "",
      organizationId: orgId ?? null,
      password: "",
      confirmPassword: "",
      userType: UserType.SubUser,
      firstNameAr: retrieveData.identityValidation?.firstNameAr ?? "",
      secondNameAr: retrieveData.identityValidation?.secondNameAr ?? "",
      familyNameAr: retrieveData.identityValidation?.familyNameAr ?? "",
      firstNameEn: retrieveData.identityValidation?.firstNameEn ?? "",
      secondNameEn: retrieveData.identityValidation?.secondNameEn ?? "",
      familyNameEn: retrieveData.identityValidation?.familyNameEn ?? "",
      address1: "",
      address2: "",
      postalCode: undefined,
      region: undefined,
      city: undefined,
      mobileNumber: "",
      jobTitle: undefined,
      jobTitleText: "",
      department: "",
      currentSite: "",
      termApproved: false,
    }
  });




  const identity = useSelector((s: RootState) => s.registrationData.identityValidation);


  const lockFromIdentityValidation = Boolean(identity);


  const firstNameEn = form.watch('firstNameEn');
  const secondNameEn = form.watch('secondNameEn');
  const familyNameEn = form.watch('familyNameEn');
  const firstNameAr = form.watch('firstNameAr');
  const secondNameAr = form.watch('secondNameAr');
  const familyNameAr = form.watch('familyNameAr');


  const disable = {
    firstNameEn: lockFromIdentityValidation && !!firstNameEn,
    secondNameEn: lockFromIdentityValidation && !!secondNameEn,
    familyNameEn: lockFromIdentityValidation && !!familyNameEn,
    firstNameAr: lockFromIdentityValidation && !!firstNameAr,
    secondNameAr: lockFromIdentityValidation && !!secondNameAr,
    familyNameAr: lockFromIdentityValidation && !!familyNameAr,
  };


  const selectedRegionId: number | undefined = form.watch('region');

  // Reset city when region changes
  useEffect(() => {
    // When region changes, make city empty (undefined), not 0
    form.setValue('city', 0, { shouldDirty: true });
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

  const onSubmit = async (data: any) => {
    try {
      const response = await register(data).unwrap();
      toast.success(response?.message);
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="create_sub_user"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.3 }}
        className=""
      >
        <div className="relative  flex items-center justify-center">
          <h2 className="text-secondary font-medium text-3xl my-1 text-center md:text-left">
            Personal Details
          </h2>
        </div>
        <FormProvider {...form}>
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 my-8">
              <FormInput name="firstNameEn" label="First Name ( EN )" type="text" disabled={disable.firstNameEn} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <FormInput name="secondNameEn" label="Second Name ( EN )" type="text" disabled={disable.secondNameEn} />
                <FormInput name="familyNameEn" label="Last Name ( EN )" type="text" disabled={disable.familyNameEn} />
              </div>
              <FormInput name="firstNameAr" nameAr label="الاسم الاول بالعربية" type="text" disabled={disable.firstNameAr} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <FormInput name="familyNameAr" nameAr label="الاسم الاخير بالعربية" type="text" disabled={disable.familyNameAr} />
                <FormInput name="secondNameAr" nameAr label="الاسم الثاني بالعربية" type="text" disabled={disable.secondNameAr} />
              </div>
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
              <FormInput name="email" label="Email Address" type="email" placeholder="you@example.com" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <FormInput name="password" label="Password" type="password" placeholder="8+ strong character" />
                <FormInput name="confirmPassword" label="Confirm Password" type="password" placeholder="Confirm your password" />
              </div>

              <Button type="submit" className="w-full py-6" isLoading={registerLoading} >
                Submit
              </Button>
            </form>
          </Form>
        </FormProvider>
      </motion.div>
    </AnimatePresence>
  )
}

export default RegisterSubUserForm