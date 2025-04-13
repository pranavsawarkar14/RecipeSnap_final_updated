'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Moon, Bell, Shield, HelpCircle, Globe, BookOpen, Menu, Home, Book, Heart, Upload, FileText, Youtube, User, Settings } from 'lucide-react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // Apply dark mode when the state changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header with Navbar */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} sticky top-0 z-10 shadow-sm`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <button 
                    aria-label="Menu"
                    className={`p-1 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className={`w-[80%] sm:w-[350px] pt-12 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <SheetHeader>
                    <SheetTitle className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="mt-8">
                    <ul className="space-y-4">
                      <li>
                        <Link
                          href="/"
                          className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100'} transition-colors`}
                        >
                          <Home className="h-5 w-5"/>
                          <span className="text-lg">Home</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/recipes"
                          className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100'} transition-colors`}
                        >
                          <Book className="h-5 w-5"/>
                          <span className="text-lg">All Recipes</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/favorites"
                          className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100'} transition-colors`}
                        >
                          <Heart className="h-5 w-5"/>
                          <span className="text-lg">Favorites</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/create-recipe"
                              className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100'} transition-colors`}>
                          <Upload className="h-6 w-6"/>
                          <span className="text-lg">Upload Photo</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/recipe-from-text"
                              className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100'} transition-colors`}>
                          <FileText className="h-6 w-6"/>
                          <span className="text-lg">Recipe from Text</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                            href="/youtube-recommendation"
                            className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100'} transition-colors`}
                        >
                            <Youtube className="h-6 w-6"/>
                            <span className="text-lg">YouTube Recommendation</span>
                        </Link>
                      </li>
                      <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} my-4`}></div>
                      <li>
                        <Link
                          href="/profile"
                          className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100'} transition-colors`}
                        >
                          <User className="h-5 w-5"/>
                          <span className="text-lg">My Profile</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/settings"
                          className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-slate-100'} transition-colors`}
                        >
                          <Settings className="h-5 w-5"/>
                          <span className="text-lg">Settings</span>
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </SheetContent>
              </Sheet>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Settings</h1>
            </div>
            <div>
              <button className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {/* Preferences Section */}
        <h3 className={`text-lg font-bold mb-2 px-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Preferences</h3>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm mb-4`}>
          <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b flex items-center justify-between`}>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-green-100'} flex items-center justify-center ${darkMode ? 'text-green-400' : 'text-green-600'} mr-3`}>
                <Moon size={20} />
              </div>
              <span>Dark Mode</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <div className={`w-11 h-6 rounded-full peer ${darkMode ? 'bg-green-500' : 'bg-gray-200'} peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
            </label>
          </div>

          <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b flex items-center justify-between`}>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-green-100'} flex items-center justify-center ${darkMode ? 'text-green-400' : 'text-green-600'} mr-3`}>
                <Bell size={20} />
              </div>
              <span>Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
              />
              <div className={`w-11 h-6 rounded-full peer ${notifications ? 'bg-green-500' : 'bg-gray-200'} peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
            </label>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-green-100'} flex items-center justify-center ${darkMode ? 'text-green-400' : 'text-green-600'} mr-3`}>
                <Globe size={20} />
              </div>
              <span>Language</span>
            </div>
            <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <span className="mr-2">English</span>
              <ChevronRight size={20} />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <h3 className={`text-lg font-bold mb-2 px-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Security</h3>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm mb-4`}>
          <div className={`p-4 flex items-center ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b`}>
            <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-green-100'} flex items-center justify-center ${darkMode ? 'text-green-400' : 'text-green-600'} mr-3`}>
              <Shield size={20} />
            </div>
            <span>Privacy & Security</span>
            <ChevronRight size={20} className={`ml-auto ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-green-100'} flex items-center justify-center ${darkMode ? 'text-green-400' : 'text-green-600'} mr-3`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={darkMode ? 'text-green-400' : 'text-green-600'}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <span>Change Password</span>
            </div>
            <ChevronRight size={20} className={`ml-auto ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* General Section */}
        <h3 className={`text-lg font-bold mb-2 px-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>General</h3>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm mb-4`}>
          <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b flex items-center justify-between`}>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-green-100'} flex items-center justify-center ${darkMode ? 'text-green-400' : 'text-green-600'} mr-3`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={darkMode ? 'text-green-400' : 'text-green-600'}>
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <span>Text Size</span>
            </div>
            <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <span className="mr-2">Medium</span>
              <ChevronRight size={20} />
            </div>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-green-100'} flex items-center justify-center ${darkMode ? 'text-green-400' : 'text-green-600'} mr-3`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={darkMode ? 'text-green-400' : 'text-green-600'}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </div>
              <span>App Information</span>
            </div>
            <ChevronRight size={20} className={`ml-auto ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* Support Section */}
        <h3 className={`text-lg font-bold mb-2 px-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Support</h3>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm`}>
          <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b flex items-center`}>
            <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-green-100'} flex items-center justify-center ${darkMode ? 'text-green-400' : 'text-green-600'} mr-3`}>
              <HelpCircle size={20} />
            </div>
            <span>Help Center</span>
            <ChevronRight size={20} className={`ml-auto ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>

          <div className="p-4 flex items-center">
            <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-green-100'} flex items-center justify-center ${darkMode ? 'text-green-400' : 'text-green-600'} mr-3`}>
              <BookOpen size={20} />
            </div>
            <span>About Springy Salads</span>
            <ChevronRight size={20} className={`ml-auto ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
        </div>

        <div className={`text-center mt-8 mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
          <p>Version 1.2.0</p>
          <p>© 2025 Pic 2 Plate</p>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;