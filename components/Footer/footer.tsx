'use client';

import Image from 'next/image';

const Footer = () => {
  return (
    <section className="py-16 mx-auto">
      <div className="">
        <footer className='mx-auto items-center justify-center'>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <img src="" alt="logo" className="mb-4 h-10" />
              <p className="font-bold">SubscriTrack</p>
            </div>
            <div>
              <h3 className="mb-4 font-bold">Product</h3>
              <ul className="space-y-4 text-zinc-600">
                <li className="font-medium text-gray-400 cursor-not-allowed">
                  <span>Overview</span>
                </li>
                <li className="font-medium text-gray-400 cursor-not-allowed">
                  <span>Pricing</span>
                </li>
                <li className="font-medium text-gray-400 cursor-not-allowed">
                  <span>Marketplace</span>
                </li>
                <li className="font-medium text-cyan-600 hover:text-cyan-700">
                  <a href="/about">Features</a>
                </li>
                <li className="font-medium text-gray-400 cursor-not-allowed">
                  <span>Integrations</span>
                </li>
                <li className="font-medium text-gray-400 cursor-not-allowed">
                  <span>Pricing</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold">Company</h3>
              <ul className="space-y-4 text-zinc-600">
                <li className="font-medium text-cyan-600 hover:text-cyan-700">
                  <a href="/about">About</a>
                </li>
                <li className="font-medium text-gray-400 cursor-not-allowed">
                  <span>Team</span>
                </li>
                <li className="font-medium text-gray-400 cursor-not-allowed">
                  <span>Blog</span>
                </li>
                <li className="font-medium text-gray-400 cursor-not-allowed">
                  <span>Careers</span>
                </li>
                <li className="font-medium text-gray-400 cursor-not-allowed">
                  <span>Contact</span>
                </li>
                <li className="font-medium text-gray-400 cursor-not-allowed">
                  <span>Privacy</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold">Resources</h3>
              <ul className="space-y-4 text-zinc-600">
                <li className="font-medium text-cyan-600 hover:text-cyan-700">
                  <a href="/docs">Help</a>
                </li>
                <li className="font-medium text-gray-400 cursor-not-allowed">
                  <span>Sales</span>
                </li>
                <li className="font-medium text-gray-400 cursor-not-allowed">
                  <span>Advertise</span>
                </li>
                <li className="font-medium text-cyan-600 hover:text-cyan-700">
                  <a href="/channels">Channels</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold">Social</h3>
              <ul className="space-y-4 text-zinc-600">
                <li className="font-medium text-gray-400 cursor-not-allowed">
                  <span>Twitter</span>
                </li>
                <li className="font-medium text-gray-400 cursor-not-allowed">
                  <span>Instagram</span>
                </li>
                <li className="font-medium text-gray-400 cursor-not-allowed">
                  <span>LinkedIn</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-zinc-600 md:flex-row md:items-center">
            <p>© 2025 SubscriTrack. All rights reserved.</p>
            <ul className="flex gap-4">
              <li className="text-gray-400 cursor-not-allowed">
                <span>Terms and Conditions</span>
              </li>
              <li className="text-gray-400 cursor-not-allowed">
                <span>Privacy Policy</span>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Footer;
