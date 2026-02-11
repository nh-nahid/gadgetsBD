import { auth } from '@/auth';
import LoginForm from '@/components/auth/LoginForm';
import { redirect } from 'next/navigation';
import React from 'react';

const LoginPage = async () => {
     const session = await auth();

  if (session?.user?.id || session?.user?._id) {
    redirect('/'); 
  }
    return (
        <>
            <LoginForm />
        </>
    );
};

export default LoginPage;