import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import MonthlyReportChart from '../components/Analysis/MonthlyReportChart';

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Banner */}
            <div className="mt-10 lg:h-[700px] h-[100px] bg-gray-100 rounded-[60px] p-4">
              {/* Left side w-40 and then gap of 20 and then right side of w-40 */}
              <div className='grid grid-cols-12 gap-10 h-full'>
                <div className='col-span-4 col-start-2 col-end-8 rounded-[60px] p-4 h-full'>
                 <div className="p-4 flex flex-col gap-4">
                  <p className='text-[#1c1b1a] text-[45px] leading-[80px] text-left mt-[70px]'>
                    The one stop platform for all your subscription needs!
                  </p>
                  <p className='text-[#1c1b1a] text-[26px] leading-[30px] text-left mt-[20px]'>
                    Set reminders for your subscriptions and get notified when they are about to expire. Never miss a renewal again or pay for a subscription you don't use.
                  </p>
                  <Link href="/signup">
                  <button className='bg-[#1c1b1a] text-white px-4 py-4 text-sm font-medium transition-colors w-[200px] mt-[20px] rounded-full'>Sign Up</button>
                  </Link>
                 </div>
                </div>
                <div className='col-span-2 col-start-9 col-end-12 rounded-[60px] p-4 h-full flex items-end justify-center relative'>
                 <Image 
                   src="/images/rocket-money.png" 
                   alt="Home Image" 
                   width={600} 
                   height={600}
                   className="object-cover transform scale-125 -mb-8"
                   style={{ maxWidth: '120%', height: 'auto' }}
                 />
                </div>
              </div>
            </div>
          </div>

        <div className='my-[100px]'>
          <MonthlyReportChart />
        </div>
    </ProtectedRoute>
  );
} 