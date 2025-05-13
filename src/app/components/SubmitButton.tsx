import { FC } from 'react';

import { useFormStatus } from 'react-dom';

import { Button } from './Button';

export const SubmitButton: FC = () => {
  const { pending } = useFormStatus();

  return <Button isPending={pending} />;
};
