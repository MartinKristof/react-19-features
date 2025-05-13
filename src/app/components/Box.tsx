import { motion } from 'framer-motion';
import { FC, ReactNode } from 'react';

interface IBoxProps {
  children: ReactNode;
}

export const Box: FC<IBoxProps> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="mb-8"
    style={{ minHeight: '455px' }}
  >
    {children}
  </motion.div>
);
