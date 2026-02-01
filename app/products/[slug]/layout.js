import "../../globals.css";

export const metadata = {
  title: "gadgetsBD",
  description: "An e-commerce platform for gadgets",
};

export default function RootLayout({ children, auth }) {
  return (
   
      <div className="bg-amazon-background text-amazon-text flex flex-col min-h-screen"

      >
      
        
        {auth}
        {children}
        
      </div>
   
  );
}
