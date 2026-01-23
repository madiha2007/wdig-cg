import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingChatbot from "@/components/FloatingChatbot";
import { AssessmentProvider } from "./context/AssessmentContext";

export const metadata = {
  title: "Where Do I Go?",
  description: "Career guidance platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
      <AssessmentProvider>
        <Navbar />

        {children}   
           <FloatingChatbot />
        <Footer />
        </AssessmentProvider>
      </body>
    </html>
  );
}

