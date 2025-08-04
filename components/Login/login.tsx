import React, { useState, FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { config } from '../../utils/config';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginProps {
  onSubmit?: (data: any) => void;
}

export default function Login({ onSubmit }: LoginProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${config.api_url}/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      
      // Handle the backend response format: { token, user, message }
      if (data.token && data.user) {
        // Store token and user data
        login(data.token, data.user);
        
        // Redirect to home page
        router.push('/home');
        
        onSubmit?.(data);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error: any) {
      setError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Open Google OAuth in a popup window or redirect
      // Since your backend handles the full OAuth flow, we need to redirect
      window.location.href = `${config.api_url}/auth/google/login`;
    } catch (error: any) {
      setError('Google sign in failed: ' + error.message);
    }
  };

  return (
    <section className="mx-auto">
      <div className="py-32">
        <div className="flex flex-col gap-4 items-center mx-auto ">
          <Image
            src="/images/logo.png"
            alt="logo"
            className="w-[90px] h-[30px]"
            width={90}
            height={30}
          />
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md">
            <div className="flex flex-col space-y-1.5 p-6 items-center">
              <h3 className="font-semibold tracking-tight text-xl">Log in with your email</h3>
              <p className="text-sm text-zinc-600">Enter your information to login</p>
            </div>
            <div className="p-6 pt-0">
              <form onSubmit={handleSubmit} className="grid gap-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-zinc-100 hover:text-zinc-800 h-10 px-4 py-2 w-full">
                  <svg className="h-5 mr-2" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"
                    xmlnsXlink="http://www.w3.org/1999/xlink" style={{ display: 'block' }}>
                    <path fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z">
                    </path>
                    <path fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z">
                    </path>
                    <path fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z">
                    </path>
                    <path fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z">
                    </path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>Sign up with Google
                </button>
                <div className="flex items-center gap-4">
                  <span className="h-px w-full bg-gray-100"></span><span className="text-xs text-zinc-600">OR</span><span
                    className="h-px w-full bg-gray-100"></span>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email">Email</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="email" 
                    placeholder="ryan@example.com" 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="password">Password</label><a href="#" className="text-sm underline">Forgot password</a>
                  </div>
                  <input 
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="password" 
                    placeholder="Enter your password" 
                    required 
                  />
                </div>
                <button
                  disabled={isLoading}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 text-white hover:bg-zinc-900/90 h-10 px-4 py-2 w-full"
                  type="submit">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </>
                  ) : (
                    'Log in'
                  )}
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </form>
            </div>
          </div>
          <div className="mx-auto flex gap-1 text-sm">
            <p>Don&#x27;t have an account yet?</p>
            <a href="/signup" className="underline">Sign up</a>
          </div>
        </div>
      </div>
    </section>
  );
}
