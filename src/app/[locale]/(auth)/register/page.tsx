'use client';
import AuthTabsHeader from '@/components/shared/AuthTabsHeader';
import ProgressSteps from '@/components/shared/ProgressSteps';
import { REGISTRATION_USER_TYPES, RegistrationUserKey } from '@/enums/enums';
import { selectCurrentStep, setStep } from '@/store/slices/registrationStepsSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Your step components
import PersonalDetailsWizard from './_components/PersonalDetailsWizard';
import UserTypeSelector from './_components/UserTypeSelectorComponent';
import VerifyIdentityStep from './_components/VerifyIdentityStep';
const OrganizationDetailsStep = lazy(() => import('./_components/OrganizationDetailsStep'));

type StepDef = {
  id: string;
  label: string;
  render: React.ReactNode;
};

export default function RegisterPage() {
  const [selectedKey, setSelectedKey] = useState<RegistrationUserKey | null>(null);
  const dispatch = useDispatch();
  const currentStep = useSelector(selectCurrentStep);

  useEffect(() => {
    dispatch(setStep(0));
  }, [dispatch]);


  const flow: StepDef[] = useMemo(() => {
    if (!selectedKey) return [];

    const selectedUserType = REGISTRATION_USER_TYPES[selectedKey];

    const commonCreate: StepDef = {
      id: 'create',
      label: 'Create account',
      render: null
    };

    const individualFlow: StepDef[] = [
      { id: 'verify', label: 'Verify identity', render: <VerifyIdentityStep /> },
      { id: 'personal', label: 'Personal details', render: <PersonalDetailsWizard selectedUserType={selectedUserType} /> },
      commonCreate,
    ];

    const organizationFlow: StepDef[] = [
      { id: 'org', label: 'Org details', render: <OrganizationDetailsStep /> },
      { id: 'verify', label: 'Verify identity', render: <VerifyIdentityStep /> },
      { id: 'personal', label: 'Personal details', render: <PersonalDetailsWizard selectedUserType={selectedUserType} /> },
      commonCreate,

    ];


    const isOrganization =
      String(selectedKey).toLowerCase().includes('org');

    return isOrganization ? organizationFlow : individualFlow;
  }, [selectedKey]);

  const handleSelect = (key: RegistrationUserKey) => {
    setSelectedKey(key);
    dispatch(setStep(1));
  };


  const flowIndex = currentStep - 1;
  const total = flow.length;



  // after you build `flow`
  const personalIndex = flow.findIndex(s => s.id === 'personal');
  const createIndex = flow.findIndex(s => s.id === 'create');

  const personalStepNumber = personalIndex >= 0 ? personalIndex + 1 : undefined;
  const createStepNumber = createIndex >= 0 ? createIndex + 1 : undefined;

  const current = flow[flowIndex];
  const isWizardStep = current?.id === 'personal' || current?.id === 'create';

  return (
    <div className="w-full max-w-lg mx-auto">
      <AuthTabsHeader />

      <div className="relative min-h-[300px] mt-5">
        {currentStep > 0 && (
          <ProgressSteps
            current={currentStep}
            total={total || 1}
            // onStepClick={(step1Based) => dispatch(setStep(step1Based))}
            lockFuture={false}
          // If your ProgressSteps supports labels, pass them:
          // labels={flow.map(s => s.label)}
          />
        )}

        <AnimatePresence mode="wait">
          {currentStep === 0 ? (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className=" w-full"
            >
              <h2 className="text-secondary font-medium text-3xl my-1">Welcome to SNIH</h2>
              <p className="text-[#C0C7CE] font-light text-sm my-1">Please choose your account type</p>
              {/* Your selector should call handleSelect(key) */}
              <UserTypeSelector onSelect={handleSelect} />
            </motion.div>
          ) : (
            // Render the step from the chosen flow
            <motion.div
              key={isWizardStep ? 'wizard' : (current?.id ?? 'unknown')}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.25 }}
              className=" w-full"
            >
              {isWizardStep ? (
                selectedKey ? (
                  <PersonalDetailsWizard selectedUserType={REGISTRATION_USER_TYPES[selectedKey]}
                    personalStep={personalStepNumber}   // NEW
                    createStep={createStepNumber}
                  />
                ) : null
              ) : current?.id === 'verify' ? (
                // <-- inject the dynamic next step
                <VerifyIdentityStep nextStep={personalStepNumber ?? 2} />
              ) : (
                current?.render ?? null
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
