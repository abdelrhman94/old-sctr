"use client";

import { Card, CardContent } from "@/components/ui/card";
import { RegistrationUserKey } from "@/enums/enums";
import { motion, Variants } from "framer-motion";
import { User, Users } from "lucide-react";
import { JSX, useState } from "react";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.3,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] // Use array for ease (cubic bezier)
    }
  })
};


type Props = {
  onSelect: (key: RegistrationUserKey) => void;
};

export default function UserTypeSelector({ onSelect }: Props) {
  const [selected, setSelected] = useState<RegistrationUserKey>('individual');

  const options: { label: string; icon: JSX.Element; key: RegistrationUserKey }[] = [
    { label: 'Individual', icon: <User size={40} />, key: 'individual' },
    { label: 'Organization', icon: <Users size={40} />, key: 'organization' }
  ];

  const handleClick = (key: RegistrationUserKey) => {
    setSelected(key);
    onSelect(key); // immediately proceed to next step
  };

  return (
    <div className="flex gap-6 justify-center mt-5">
      {options.map((opt, index) => (
        <motion.div
          key={opt.key}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card
            onClick={() => handleClick(opt.key)}
            className={`w-48 h-48 cursor-pointer transition-colors border-2 rounded-xl flex flex-col items-center justify-center space-y-3 ${selected === opt.key ? "border-primary" : "border-muted hover:border-gray-400"
              }`}
          >
            <CardContent className="flex flex-col items-center justify-center">
              {opt.icon}
              <span className="text-lg font-semibold mt-4">{opt.label}</span>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
