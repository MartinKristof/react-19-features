import { FC, ReactNode } from 'react';
import { ErrorMessage } from './ErrorMessage';

interface IFormGroupProps {
  id: string;
  children: ReactNode;
  label?: string;
  errors?: string[];
}

export const FormGroup: FC<IFormGroupProps> = ({ id, children, label = 'Your input', errors }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}:{children}
    </label>
    {errors && errors.length > 0 && (
      <div className="min-h-[24px] mt-1">
        {errors.map(error => (
          <ErrorMessage key={error}>{error}</ErrorMessage>
        ))}
      </div>
    )}
  </div>
);
