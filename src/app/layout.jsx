// import "./globals.css";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import FloatingChatbot from "@/components/FloatingChatbot";
// import { AssessmentProvider } from "./context/AssessmentContext";
// import { UserProvider } from "./context/UserContext";  
// import { AuthProvider } from "./context/AuthContext";


// export const metadata = {
//   title: "Where Do I Go?",
//   description: "Career guidance platform",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="min-h-screen">
//        <UserProvider>
//         <AssessmentProvider>
//           <Navbar />
//             {children}   
//           <FloatingChatbot />
//           <Footer />
//         </AssessmentProvider>
//       </UserProvider>
//       </body>
//     </html>
//   );
// }

import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingChatbot from "@/components/FloatingChatbot";
import { AssessmentProvider } from "./context/AssessmentContext";
import { UserProvider } from "./context/UserContext";
import { AuthProvider } from "./context/AuthContext";

export const metadata = {
  title: "Where Do I Go?",
  description: "Career guidance platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AuthProvider>          {/* ← Auth outermost so Navbar can read it */}
          <UserProvider>
            <AssessmentProvider>
              <Navbar />
                {children}
              <FloatingChatbot />
              <Footer />
            </AssessmentProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}