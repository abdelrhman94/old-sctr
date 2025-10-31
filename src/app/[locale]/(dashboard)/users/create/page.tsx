'use client';

import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import RegisterSubUserForm from '../_components/RegisterSubUserForm';
import VerifyIdentityForm from '../_components/VerifyIdentityForm';
import { AnimatePresence, motion } from 'framer-motion';

const CreateSubUser = () => {
  const isVerified = useSelector(
    (s: RootState) => Boolean(s.registrationData.identityValidation)
  );

  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold">Create New Sub User</h1>
      <section className="my-6 bg-white rounded-2xl border min-h-[600px] grid justify-items-center p-10 grid-cols-6">
        <div className="col-span-4 col-start-2 w-full">
          <AnimatePresence mode="wait">
            {isVerified ? (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <RegisterSubUserForm />
              </motion.div>
            ) : (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.25 }}
              >
                <VerifyIdentityForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </section>
  );
};

export default CreateSubUser;
