'use client';

import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import React, { useEffect } from 'react';

import { Button } from "@/components/ui/button";
import { useConfirmEmailMutation } from "@/store/api/authApi";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";

const ActivatePage: React.FC = () => {
  const [token] = useQueryState("code");
  const [email] = useQueryState("email");

  const router = useRouter();

  const [
    confirmEmail,
    { isLoading, isSuccess, isError }
  ] = useConfirmEmailMutation();

  useEffect(() => {
    if (email && token) {
      confirmEmail({ code: token, email });
    }
  }, [email, token]);



  const handleGoToLogin = () => {
    router.push('/login');
  };


  // Loading state
  if (isLoading || !token) {
    return (
      <div className="w-full max-w-2xl mx-auto m-8">
        <div className=" p-8 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Your Email</h2>

            <p className="text-center text-gray-600">
              Please wait while we confirm your email address...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8">
        <div className=" p-8 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Confirmed!</h2>

            <p className="text-center text-gray-600 mb-6">
              Your email address has been successfully verified. You can now access all features of your account.
            </p>

            <Button
              className="!p-6" variant="default"
              onClick={handleGoToLogin}

            >

              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8">
        <div className=" p-8 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>

            <p className="text-center text-gray-600 mb-6">
              We couldn&apos;t verify your email address. The confirmation link may have expired or is invalid.
            </p>

            <div className="w-full space-y-4">
              <Button
                className="!p-6" variant="default"
                onClick={handleGoToLogin}

              >

                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ActivatePage;