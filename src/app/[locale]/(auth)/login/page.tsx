'use client'
import AuthTabsHeader from '@/components/shared/AuthTabsHeader';
import { AnimatePresence, motion } from "framer-motion";
import LoginForm from './_components/LoginForm';

const LoginPage = () => {

  return (
    <div className="w-full max-w-lg mx-auto">
      <AuthTabsHeader />
      <div className="relative min-h-[300px] mt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.3 }}
            className=" w-full"
          >
            <h2 className='text-secondary font-medium text-3xl my-1'>Welcome to SNIH</h2>
            <p className='text-[#C0C7CE] font-light text-sm my-1'>Thank you for coming back!</p>
            <LoginForm />
          </motion.div>
        </AnimatePresence>
      </div>
    </div >
  )
}

export default LoginPage