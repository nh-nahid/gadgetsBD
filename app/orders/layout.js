
import Navbar from "@/components/Navbar";
import "../globals.css";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Orders-GadgetsBD",
    description: "An e-commerce platform for gadgets",
};

export default function RootLayout({ children, auth }) {
    return (

        <div>
            <SessionProvider>
                <Navbar />
                {auth}
                {children}
                <Footer />
            </SessionProvider>
        </div>


    );
}
