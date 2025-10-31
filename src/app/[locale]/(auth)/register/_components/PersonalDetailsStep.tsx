'use client'
import { FormInput } from '@/components/shared/FormInput';
import { RootState } from '@/store/store';
import { AnimatePresence, motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';




const PersonalDetailsStep = () => {

  const { watch } = useFormContext();
  const identity = useSelector((s: RootState) => s.registrationData.identityValidation);


  const lockFromIdentityValidation = Boolean(identity);


  const firstNameEn = watch('firstNameEn');
  const secondNameEn = watch('secondNameEn');
  const familyNameEn = watch('familyNameEn');
  const firstNameAr = watch('firstNameAr');
  const secondNameAr = watch('secondNameAr');
  const familyNameAr = watch('familyNameAr');


  const disable = {
    firstNameEn: lockFromIdentityValidation && !!firstNameEn,
    secondNameEn: lockFromIdentityValidation && !!secondNameEn,
    familyNameEn: lockFromIdentityValidation && !!familyNameEn,
    firstNameAr: lockFromIdentityValidation && !!firstNameAr,
    secondNameAr: lockFromIdentityValidation && !!secondNameAr,
    familyNameAr: lockFromIdentityValidation && !!familyNameAr,
  };


  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="personal_details"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 w-full"
      >

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
      </motion.div>
    </AnimatePresence>


  )
}

export default PersonalDetailsStep