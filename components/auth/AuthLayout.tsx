import React from 'react';
import { APP_NAME } from '../../constants';
import { BriefcaseIcon } from '../icons'; // Or a more specific Macrum logo icon

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-lightest via-neutral-light to-primary/10 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center mb-6">
          <BriefcaseIcon className="h-12 w-auto text-macrum-primary" />
          <h1 className="ml-3 text-4xl font-bold text-macrum-primary">{APP_NAME}</h1>
        </div>
        <h2 className="mt-6 text-center text-2xl font-semibold text-neutral-darkest">
          {title}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};
