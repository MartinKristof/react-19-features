import classNames from 'classnames';

import { ComponentPropsWithRef, FC, Ref } from 'react';

interface IInputPropsBase {
  className?: string;
  variant?: 'input' | 'textarea';
}

type IInputProps =
  | (IInputPropsBase & ComponentPropsWithRef<'input'> & { variant?: 'input' })
  | (IInputPropsBase & ComponentPropsWithRef<'textarea'> & { variant: 'textarea' });

export const Input: FC<IInputProps> = ({ variant = 'input', ref, className = '', ...rest }) => {
  const commonClasses =
    'w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500';

  return variant === 'textarea' ? (
    <textarea
      ref={ref as Ref<HTMLTextAreaElement>}
      className={classNames(commonClasses, className)}
      {...(rest as ComponentPropsWithRef<'textarea'>)}
    />
  ) : (
    <input
      ref={ref as Ref<HTMLInputElement>}
      className={classNames(commonClasses, className)}
      {...(rest as ComponentPropsWithRef<'input'>)}
    />
  );
};
