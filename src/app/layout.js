import { Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata = {
  title: 'CrowdFundHub - Crowdfunding Platform',
  description: 'A modern crowdfunding platform connecting creators with supporters worldwide.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-[family-name:var(--font-poppins)]">
        <AuthProvider>
          {children}
          <ToastContainer position="top-right" autoClose={3000} theme="light" />
        </AuthProvider>
      </body>
    </html>
  );
}
