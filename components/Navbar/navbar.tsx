import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [parsedUserName, setParsedUserName] = useState('');
  useEffect(() => {
    const parseUserName = (user: any) => {
      if(user){
        const name = user.name;
        const firstName = name.split(' ')[0];
        return firstName;
      }
      return '';
    }
    setParsedUserName(parseUserName(user));
  },[user])
  console.log(user);
  return (
    <div className="flex flex-col w-full">

      {/* Main Navbar */}
      <nav className="flex flex-row justify-between items-center px-8 py-4">
        {/* Left Side */}
        <div className="flex flex-row gap-8 items-center">
          <Link href="/home">
            <Image
              src=""
              alt="SubscriTracker Logo"
              width={220}
              height={60}
              className="h-12 w-auto"
            />
          </Link>
         
          <a
            href="/channels"
            className="text-[#020202] px-4 py-2 text-sm font-normal leading-5 opacity-70 hover:opacity-100 transition-all duration-200 ease-in-out"
          >
            Channels
          </a>
          <a
            href="/about"
            className="text-[#020202] px-4 py-2 text-sm font-normal leading-5 opacity-70 hover:opacity-100 transition-all duration-200 ease-in-out"
          >
            About
          </a>
         
        </div>
        {/* Right Side */}
        <div className="flex flex-row gap-4 items-center">
          {user && user.name ?
          <a
            href="/docs"
            className="text-[#020202] px-4 py-2 text-sm font-normal leading-5 opacity-70 hover:opacity-100 transition-all duration-200 ease-in-out"
          >
            Welcome, {parsedUserName}
          </a>
          :
          <></>
        }

        {user && user.name ?
          <a
            onClick={logout}
            className="text-[#020202] px-4 py-2 text-sm font-normal leading-5 opacity-70 hover:opacity-100 transition-all duration-200 ease-in-out"
          >
            Logout
          </a>
 : 
          <a
            href="/account"
            className="text-[#020202] px-4 py-2 text-sm font-normal leading-5 opacity-70 hover:opacity-100 transition-all duration-200 ease-in-out"
          >
            Sign Up
          </a>
}
        </div>
      </nav>
    </div>
  );
}
