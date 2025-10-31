'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import VerifyIdentityStepInner from './VerifyIdentityStepInner';

export default function VerifyIdentityStep(props: { nextStep?: number }) {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
      <VerifyIdentityStepInner {...props} />
    </GoogleReCaptchaProvider>
  );
}


