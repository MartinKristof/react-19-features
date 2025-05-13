import classNames from 'classnames';

import { ComponentPropsWithRef, FC, Ref } from 'react';

interface IInputPropsBase {
  className?: string;
  variant?: 'input' | 'textarea';
  invalid?: boolean;
}

type IInputProps =
  | (IInputPropsBase & ComponentPropsWithRef<'input'> & { variant?: 'input' })
  | (IInputPropsBase & ComponentPropsWithRef<'textarea'> & { variant: 'textarea' });

export const Input: FC<IInputProps> = ({ variant = 'input', ref, invalid, className = '', ...rest }) => {
  const commonClasses = `mt-2 w-full border ${
    invalid ? 'border-[#E81D2E] ring-1 ring-[#E81D2E]' : 'border-gray-300'
  } p-2 rounded-lg focus:ring-2 ${
    invalid ? 'focus:ring-[#E81D2E]' : 'focus:ring-[#0071E1]'
  } focus:border-transparent transition-all`;

  return variant === 'textarea' ? (
    <textarea
      ref={ref as Ref<HTMLTextAreaElement>}
      className={classNames(commonClasses, className)}
      autoComplete="off"
      {...(rest as ComponentPropsWithRef<'textarea'>)}
    />
  ) : (
    <input
      ref={ref as Ref<HTMLInputElement>}
      className={classNames(commonClasses, className)}
      autoComplete="off"
      {...(rest as ComponentPropsWithRef<'input'>)}
    />
  );
};
