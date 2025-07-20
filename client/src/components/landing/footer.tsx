import { Link } from "wouter";
import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                <Heart className="h-5 w-5 text-white fill-white" />
              </div>
              <span className="font-bold text-xl">SereneAI</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Professional mental health platform powered by AI technology.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-300 hover:text-white transition-colors duration-200">Features</a></li>
              <li><a href="#testimonials" className="text-gray-300 hover:text-white transition-colors duration-200">Testimonials</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div id="contact">
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li><a href="mailto:support@sereneai.com" className="text-gray-300 hover:text-white transition-colors duration-200">support@sereneai.com</a></li>
              <li><span className="text-gray-300">Available 24/7</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; {currentYear} SereneAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
