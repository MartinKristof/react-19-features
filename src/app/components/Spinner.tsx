import { FC } from 'react';
import { motion } from 'framer-motion';

export const Spinner: FC = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: 'linear' }}
      className="w-12 h-12 border-4 border-[#0071E1]/20 border-t-[#0071E1] rounded-full mb-4"
    />
    <p className="text-gray-500 font-medium">Loading posts...</p>
  </div>
);
