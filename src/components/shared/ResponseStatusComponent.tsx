'use client'
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/navigation';
import { BadgeCheck, BadgeX } from 'lucide-react';


type Props = {
  btnName: string;
  routeLink: string;
  status: string;
  title: string;
  description: string;
}

const ResponseStatusComponent = ({ btnName, routeLink, status, title, description }: Props) => {
  const router = useRouter();
  const handleRoute = () => {
    router.push(routeLink);
  };
  return (
    <div className="w-full max-w-2xl mx-auto m-8">
      <div className=" p-8 bg-white ">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center justify-center  rounded-full bg-green-100 mb-4">
            {status === 'success' && <BadgeCheck   className="h-30 w-30 text-green-600" />}
            {status === 'reject' && <BadgeX className="h-30 w-30 text-red-600" />}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-center text-gray-600 mb-6">
            {description}
          </p>
          <Button
            className="!p-6 w-1/2" variant="default"
            onClick={handleRoute}
          >
            {btnName}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ResponseStatusComponent