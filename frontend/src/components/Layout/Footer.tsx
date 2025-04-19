import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, TwitterIcon, InstagramIcon } from 'lucide-react';
const Footer: React.FC = () => {
  return <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">FoodFast</h3>
            <p className="text-sm">
              The fastest and most reliable food delivery service. Order from
              your favorite restaurants.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-white">
                <FacebookIcon size={20} />
              </a>
              <a href="#" className="hover:text-white">
                <TwitterIcon size={20} />
              </a>
              <a href="#" className="hover:text-white">
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-white mb-4">About Us</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="hover:text-white">
                  About FoodFast
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Investors
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Company Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-4">Help</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="hover:text-white">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Order Status
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Delivery Issues
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-4">For Restaurants</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="hover:text-white">
                  Become a Partner
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Restaurant Dashboard
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white">
                  Marketing Solutions
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between">
            <p>© 2023 FoodFast. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <Link to="#" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link to="#" className="hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;