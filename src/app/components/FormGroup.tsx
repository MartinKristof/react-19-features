import { FC, ReactNode } from 'react';
import { ErrorMessage } from './ErrorMessage';

interface IFormGroupProps {
  id: string;
  children: ReactNode;
  label?: string;
  errors?: string[];
}

export const FormGroup: FC<IFormGroupProps> = ({ id, children, label = 'Your input', errors }) => (
  <div className="mt-2">
    <label htmlFor={id} className="block mb-2 text-sm font-medium">
      {label}:{children}
    </label>
    {errors && errors.length > 0 && errors.map(error => <ErrorMessage key={error}>{error}</ErrorMessage>)}
  </div>
);
