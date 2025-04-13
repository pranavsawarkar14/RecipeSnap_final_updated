'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { Book, Heart, Home, Menu, Settings, Upload, User, FileText, Youtube } from 'lucide-react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type TabType = 'profile' | 'favorites' | 'settings';

interface FavoriteItem {
  id: string;
  name: string;
  calories: number;
  imageUrl: string;
}

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [profileData, setProfileData] = useState({
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    bio: "Passionate about healthy eating and discovering new recipes. Always looking for nutritious meal ideas that don't compromise on flavor.",
    profileImage: '/images/profile.jpg'
  });
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(['Vegetarian', 'Low Carb', 'High Protein']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const favorites: FavoriteItem[] = [
    { id: '1', name: 'Chicken Fried Salad', calories: 250, imageUrl: '/images/salad.jpg' },
    { id: '2', name: 'Pasta Bolognese', calories: 200, imageUrl: '/images/pasta.jpg' },
    { id: '3', name: 'Garlic Potatoes', calories: 150, imageUrl: '/images/potatoes.jpg' },
  ];

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileData(prev => ({
            ...prev,
            profileImage: event.target!.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPreference = () => {
    const newPreference = prompt('Enter new dietary preference:');
    if (newPreference && !dietaryPreferences.includes(newPreference)) {
      setDietaryPreferences([...dietaryPreferences, newPreference]);
    }
  };

  const handleRemovePreference = (pref: string) => {
    setDietaryPreferences(dietaryPreferences.filter(p => p !== pref));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Profile data saved:', profileData, dietaryPreferences);
    alert('Profile changes saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <button 
                    aria-label="Menu"
                    className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[80%] sm:w-[350px] pt-12">
                  <SheetHeader>
                    <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="mt-8">
                    <ul className="space-y-4">
                      <li>
                        <Link
                          href="/"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Home className="h-5 w-5"/>
                          <span className="text-lg">Home</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/recipes"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Book className="h-5 w-5"/>
                          <span className="text-lg">All Recipes</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/favorites"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Heart className="h-5 w-5"/>
                          <span className="text-lg">Favorites</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/create-recipe"
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors">
                          <Upload className="h-6 w-6"/>
                          <span className="text-lg">Upload Photo</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/recipe-from-text"
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors">
                          <FileText className="h-6 w-6"/>
                          <span className="text-lg">Recipe from Text</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                            href="/youtube-recommendation"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <Youtube className="h-6 w-6"/>
                            <span className="text-lg">YouTube Recommendation</span>
                        </Link>
                      </li>
                      <div className="border-t my-4"></div>
                      <li>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <User className="h-5 w-5"/>
                          <span className="text-lg">My Profile</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Settings className="h-5 w-5"/>
                          <span className="text-lg">Settings</span>
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </SheetContent>
              </Sheet>
              <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <section className="flex flex-col items-center mb-8">
          {/* Profile picture with upload functionality */}
          <div className="relative group">
            <div 
              className="relative w-24 h-24 rounded-full mb-4 overflow-hidden border-4 border-white shadow-md cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image
                src={profileData.profileImage}
                alt="Profile picture"
                width={96}
                height={96}
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="w-6 h-6 text-white" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfileImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-1">{profileData.fullName}</h2>
          <p className="text-gray-600 mb-6">Health enthusiast</p>
          
          {/* Tabs Navigation */}
          <nav className="w-full max-w-md mb-6">
            <ul className="flex bg-white rounded-full shadow-sm overflow-hidden">
              {(['profile', 'favorites', 'settings'] as TabType[]).map((tab) => (
                <li key={tab} className="flex-1">
                  <button
                    onClick={() => handleTabChange(tab)}
                    className={`w-full py-3 text-center font-medium transition-colors duration-200 ${
                      activeTab === tab 
                        ? 'bg-green-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    aria-current={activeTab === tab ? 'page' : undefined}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </section>
        
        {/* Tab Content */}
        <section className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary Preferences
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {dietaryPreferences.map((pref) => (
                      <span 
                        key={pref} 
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center"
                      >
                        {pref}
                        <button
                          type="button"
                          onClick={() => handleRemovePreference(pref)}
                          className="ml-1 text-green-800 hover:text-red-500"
                          aria-label={`Remove ${pref}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddPreference}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm flex items-center hover:bg-gray-300"
                    >
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                        <path d="M6 1V11M1 6H11" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Add
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}
          
          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Favorite Recipes</h2>
              
              <ul className="space-y-3">
                {favorites.map((item) => (
                  <li key={item.id}>
                    <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.calories} Kcal</p>
                      </div>
                      <button 
                        aria-label={`Remove ${item.name} from favorites`}
                        className="p-1 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              
              {favorites.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">You haven't added any favorites yet.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h2>
                
                <ul className="space-y-3">
                  <SettingToggleItem 
                    label="Push Notifications"
                    id="pushNotifications"
                    defaultChecked
                  />
                  <SettingToggleItem 
                    label="Email Notifications"
                    id="emailNotifications"
                  />
                  <SettingToggleItem 
                    label="Dark Mode"
                    id="darkMode"
                  />
                </ul>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Privacy</h2>
                
                <ul className="space-y-3">
                  <SettingToggleItem 
                    label="Public Profile"
                    id="publicProfile"
                    defaultChecked
                  />
                  <SettingToggleItem 
                    label="Share Activity"
                    id="shareActivity"
                    defaultChecked
                  />
                </ul>
              </div>
              
              <div className="mt-8">
                <button
                  type="button"
                  className="w-full py-3 text-red-600 font-medium border border-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

interface SettingToggleItemProps {
  label: string;
  id: string;
  defaultChecked?: boolean;
}

const SettingToggleItem = ({ label, id, defaultChecked = false }: SettingToggleItemProps) => {
  return (
    <li className="flex justify-between items-center py-3 border-b border-gray-200">
      <label htmlFor={id} className="text-gray-700 cursor-pointer">
        {label}
      </label>
      <div className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          id={id} 
          className="sr-only peer" 
          defaultChecked={defaultChecked}
        />
        <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-green-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
      </div>
    </li>
  );
};

export default ProfilePage;