'use client';

import {Book, Heart, Home, Menu, Search, Settings, Upload, User, FileText, Youtube} from 'lucide-react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {useIsMobile} from '@/hooks/use-mobile';
import {useState, useRef, useEffect} from "react";
import {useRouter} from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface NavbarProps {
  onSearch?: (term: string) => void;
}

const Navbar = ({onSearch}: NavbarProps) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onSearch?.(term);
  };

  useEffect(() => {
    if (isSearchOpen) {
      const input = searchRef.current?.querySelector('input');
      input?.focus();
    }
  }, [isSearchOpen]);

  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Book, label: 'All Recipes', href: '/recipes' },
    { icon: Heart, label: 'Favorites', href: '/favorites' },
    { icon: Upload, label: 'Upload Photo', href: '/create-recipe' },
    { icon: FileText, label: 'Recipe Generator', href: '/recipe-from-text' },
    { icon: Youtube, label: 'YouTube Recommendation', href: '/youtube-recommendation' },
    { icon: User, label: 'My Profile', href: '/profile' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="flex justify-between items-center py-4">
      <Sheet onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <motion.button 
            className="p-2 rounded-full hover:bg-gray-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              rotate: isMenuOpen ? 90 : 0,
              transition: { duration: 0.3 }
            }}
          >
            <Menu className="h-6 w-6"/>
          </motion.button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80%] sm:w-[350px] pt-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <SheetHeader>
              <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
            </SheetHeader>

            <nav className="mt-8">
              <ul className="space-y-4">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.3,
                      delay: 0.2 + (index * 0.05)
                    }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <item.icon className="h-5 w-5"/>
                      <span className="text-lg">{item.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2">
        <div className="relative h-10 flex items-center" ref={searchRef}>
          <AnimatePresence mode="wait">
            {isSearchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: isMobile ? 180 : 250, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ 
                  duration: 0.25,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="absolute right-0"
              >
                <div className="flex items-center bg-white shadow-md rounded-full px-4 py-2 border border-gray-200">
                  <Search className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search recipes..."
                    className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchTerm('');
                    }}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(true)}
                className="absolute right-0 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <Search className="w-6 h-6" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
