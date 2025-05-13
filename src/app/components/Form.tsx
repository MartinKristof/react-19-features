import { motion } from 'framer-motion';
import { ComponentPropsWithRef, FC, ReactNode } from 'react';

interface IFormProps extends ComponentPropsWithRef<'form'> {
  children: ReactNode;
}

export const Form: FC<IFormProps> = ({ children, ...rest }) => (
  <motion.div
    className="bg-white rounded-xl shadow-lg p-6 border border-slate-200"
    whileHover={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
    transition={{ duration: 0.2 }}
  >
    <form {...rest}>{children}</form>
  </motion.div>
);
