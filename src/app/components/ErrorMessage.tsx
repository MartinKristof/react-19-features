import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface IErrorMessage {
  children: ReactNode;
}

export const ErrorMessage: FC<IErrorMessage> = ({ children }) => (
  <motion.p
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-[#E81D2E] text-sm flex items-center"
  >
    <AlertCircle className="w-3 h-3 mr-1" />
    {children}
  </motion.p>
);
