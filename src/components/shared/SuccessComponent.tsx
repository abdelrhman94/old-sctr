'use client'
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/navigation';
import { CheckCircle } from 'lucide-react';

const SuccessComponent = ({ btnName }: { btnName: string }) => {
  const router = useRouter();
  const handleGoToHome = () => {
    router.push('/');
  };
  return (
    <div className="w-full max-w-2xl mx-auto m-8">
      <div className=" p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your account has been created successfully!</h2>
          <p className="text-center text-gray-600 mb-6">
            Our team will be reviewing your account details. An email will be sent to you once your account is activated
          </p>
          <Button
            className="!p-6" variant="default"
            onClick={handleGoToHome}
          >
            {btnName}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SuccessComponent