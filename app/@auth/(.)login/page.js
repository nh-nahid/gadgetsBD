import AuthModal from '@/components/auth/AuthModal';
import LoginForm from '@/components/auth/LoginForm';
import React from 'react';

const LoginPage = () => {
    
    return (
        <>

            <AuthModal >

                <LoginForm />

            </AuthModal>
        </>
    );
};

export default LoginPage;