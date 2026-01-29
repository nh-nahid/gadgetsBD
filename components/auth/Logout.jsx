"use client"
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';


const Logout = () => {
    return (
        <button onClick={() =>  {
            signOut({callbackUrl: "http://localhost:3000/login"})
        }}>
            <LogOut className='h-5 -mb-1 ml-1' />
        </button>
    );
};

export default Logout;