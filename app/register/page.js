import { auth } from "@/auth";
import RegisterForm from "@/components/auth/RegisterForm";
import { redirect } from "next/navigation";


 async function RegisterPage() {
       const session = await auth();
  
    if (session?.user?._id || session?.user?.id) {
      redirect('/'); 
    }
  return (
    <div className="min-h-screen flex justify-center items-center">
      <RegisterForm />
    </div>
  );
}


export default RegisterPage;