'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { Menu, X, Home, AlertTriangle, Award, HelpCircle, UserPlus, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);
  const { userToken, adminToken, logout, adminLogout } = useAuth();

  const springConfig = { stiffness: 300, damping: 30 };
  const yAnimation = useSpring(0, springConfig);

  useEffect(() => {
    let prevScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - prevScrollY;
      yAnimation.set(Math.min(Math.max(-diff, -100), 0));
      prevScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [yAnimation]);

  const menuItems = [
    { name: 'Home', href: '/', icon: Home }, 
    { name: 'Report', href: '/report', icon: AlertTriangle }, 
    { name: 'Rewards', href: '/rewards', icon: Award }, 
    { name: 'Support', href: '/support', icon: HelpCircle }, 
  ];

  const authItems = userToken
    ? [{ name: 'Logout', href: '#', icon: LogOut, onClick: logout }]
    : [
        { name: 'Sign Up', href: '/register', icon: UserPlus }, 
        { name: 'Login', href: '/login', icon: LogIn }, 
      ];

  const adminItems = adminToken
    ? [
        { name: 'Admin Dashboard', href: '/admindash', icon: LayoutDashboard },
        { name: 'Logout', href: '#', icon: LogOut, onClick: adminLogout },
      ]
    : [
        { name: 'Admin Login', href: '/adminlogin', icon: LogIn }, 
        { name: 'Admin Register', href: '/adminregister', icon: UserPlus }, 
      ];

  return (
    <motion.header 
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 rounded-b-lg shadow-lg"
      style={{ y: yAnimation }}
    >
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center text-xl font-bold text-white hover:text-teal-100 transition-all duration-300 transform hover:scale-105">
            <Image src="/images/logo.png" alt="StreetGuardian Logo" width={40} height={40} className="mr-2 rounded-full" />
            <span className="hidden sm:inline">StreetGuardian</span>
          </Link>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-1">
            {menuItems.map((item) => (
              <NavItem key={item.name} {...item} />
            ))}
            <NavDropdown title="User" items={authItems} />
            <NavDropdown title="Admin" items={adminItems} />
            <SOSButton />
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden bg-white p-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-teal-500" />
            ) : (
              <Menu className="h-6 w-6 text-teal-500" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <ul className="py-2">
              {menuItems.map((item) => (
                <MobileNavItem key={item.name} {...item} onClick={() => setIsMenuOpen(false)} />
              ))}
              <MobileNavDropdown title="User" items={authItems} onClick={() => setIsMenuOpen(false)} />
              <MobileNavDropdown title="Admin" items={adminItems} onClick={() => setIsMenuOpen(false)} />
              <li className="px-4 py-2">
                <SOSButton isMobile />
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

const NavItem = ({ name, href, icon: Icon }) => (
  <Link href={href} className="text-white hover:text-teal-100 px-3 py-2 rounded-full transition-all duration-300 hover:bg-white/10 flex items-center space-x-1">
    <Icon className="h-4 w-4" />
    <span>{name}</span>
  </Link>
);

const NavDropdown = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { userToken, adminToken } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentItems = title === 'User' 
    ? (userToken ? [{ name: 'Logout', href: '#', icon: LogOut, onClick: items[0].onClick }] : items)
    : (adminToken ? [
        { name: 'Admin Dashboard', href: '/admindash', icon: LayoutDashboard },
        { name: 'Logout', href: '#', icon: LogOut, onClick: items[1].onClick }
      ] : items);

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:text-teal-100 px-3 py-2 rounded-full transition-all duration-300 hover:bg-white/10 flex items-center space-x-1"
      >
        <span>{title}</span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`absolute ${title === 'Admin' ? 'right-0' : 'left-0'} mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none overflow-hidden`}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            {currentItems.map((item) => (
              <motion.li 
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-teal-500 hover:text-white transition-colors duration-200"
                  onClick={() => {
                    setIsOpen(false);
                    if (item.onClick) {
                      item.onClick();
                    }
                    
                  }}
                >
                  <item.icon className="mr-3 h-5 w-5 text-blue-400 group-hover:text-blue-400" aria-hidden="true" />
                  {item.name}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileNavItem = ({ name, href, icon: Icon, onClick }) => (
  <motion.li
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link
      href={href}
      className="flex items-center px-4 py-2 text-teal-600 hover:bg-teal-50 hover:text-teal-800 transition-colors duration-300 rounded-lg"
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mr-2" />
      {name}
    </Link>
  </motion.li>
);

const MobileNavDropdown = ({ title, items, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { userToken, adminToken } = useAuth();

  const currentItems = title === 'User' 
    ? (userToken ? [{ name: 'Logout', href: '#', icon: LogOut, onClick: items[0].onClick }] : items)
    : (adminToken ? [
        { name: 'Admin Dashboard', href: '/admindash', icon: LayoutDashboard },
        { name: 'Logout', href: '#', icon: LogOut, onClick: items[1].onClick }
      ] : items);

  return (
    <li>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-teal-600 hover:bg-teal-50 hover:text-teal-800 transition-colors duration-300 rounded-lg"
      >
        <span>{title}</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-teal-50 rounded-xl mt-1 overflow-hidden"
          >
            {currentItems.map((item) => (
              <motion.li 
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className="group flex items-center px-8 py-2 text-sm text-teal-600 hover:bg-teal-100 hover:text-teal-800 transition-colors duration-300 rounded-lg"
                  onClick={() => {
                    onClick();
                    if (item.onClick) {
                      item.onClick();
                    }
                    
                  }}
                >
                  <item.icon className="mr-3 h-5 w-5 text-blue-400 group-hover:text-blue-400" aria-hidden="true" />
                  {item.name}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

const SOSButton = ({ isMobile = false }) => {
  const [isBlinking, setIsBlinking] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(prev => !prev);
    }, 250); 

    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href="/sos" 
      className={`
        ${isMobile ? 'w-full justify-center' : ''}
        inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl
        transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105
        ${isBlinking ? 'opacity-100' : 'opacity-70'}
      `}
    >
      <AlertTriangle className="h-5 w-5 mr-2" />
      SOS
    </Link>
  );
};

export default Navbar;

