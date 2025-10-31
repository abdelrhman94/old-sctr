'use client'
import { FormInput } from "@/components/shared/FormInput";
import { AnimatePresence, motion } from "framer-motion";

const CreateAccountStep = () => {

  return (
    
    <AnimatePresence mode="wait">
      <motion.div
        key="create_account"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 w-full"
      >
        <FormInput name="email" label="Email Address" type="email" placeholder="you@example.com" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <FormInput name="password" label="Password" type="password" placeholder="8+ strong character" />
          <FormInput name="confirmPassword" label="Confirm Password" type="password" placeholder="Confirm your password" />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CreateAccountStep