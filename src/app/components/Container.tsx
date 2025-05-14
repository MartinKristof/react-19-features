import { FC, ReactNode } from 'react';

interface IContainerProps {
  children: ReactNode;
}

export const Container: FC<IContainerProps> = ({ children }) => (
  <div className="p-6 max-w-5xl mx-auto w-full">{children}</div>
);
