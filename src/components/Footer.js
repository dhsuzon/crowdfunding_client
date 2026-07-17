import Link from 'next/link';
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-4">CrowdFundHub</h3>
            <p className="text-gray-400">Empowering creators and innovators to bring their ideas to life through community support.</p>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-indigo-400 transition">Home</Link></li>
              <li><Link href="/campaigns" className="hover:text-indigo-400 transition">Explore Campaigns</Link></li>
              <li><Link href="/register" className="hover:text-indigo-400 transition">Get Started</Link></li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-white mb-4">Connect With Us</h4>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="https://www.facebook.com/didarsuzon" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-indigo-400 transition"><FaFacebook /></a>
              <a href="https://www.linkedin.com/in/dider-hossain-suzon" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-indigo-400 transition"><FaLinkedin /></a>
              <a href="https://github.com/dhsuzon" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-indigo-400 transition"><FaGithub /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} CrowdFundHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
