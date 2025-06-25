import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PiSignOut } from "react-icons/pi";
import { AuthContext } from '../../context/AuthContext';

function NavBar() {
  const { isAuth, signOut, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState({ carts: false, recipes: false });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (menu) => {
    setIsDropdownOpen((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen({ carts: false, recipes: false });
  };

  const closeDropdown = () => {
    setIsDropdownOpen({ carts: false, recipes: false });
  };

  const handleLinkClick = () => {
    closeMenu();
    closeDropdown();
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
    closeMenu();
  };

  return (
    <nav className="w-full bg-gradient-to-r from-green-900 via-green-700 to-green-800 relative z-40">
      <div className="max-w-screen-2xl w-11/12 mx-auto flex justify-between items-center py-3 relative">
        {/* Logo and User Info */}
        <div className="flex items-center gap-2 md:gap-6">
          <Link
            to="/"
            className="transition-transform hover:scale-105 flex items-center gap-2 md:gap-4"
            onClick={handleLinkClick}
          >
            <img src="/FamCart.png" alt="Logo" className="w-10 md:w-14 rounded-2xl" />
          </Link>
          <Link
            to="/profile"
            className="transition-transform hover:scale-105 flex items-center gap-2 md:gap-4"
            onClick={handleLinkClick}
          >
            <p className="text-white text-2xl">{user?.userName}</p>
          </Link>
        </div>

        {/* Center Navigation Links - Desktop */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
          <ul className="flex gap-4 lg:gap-8">
            <li>
              <Link
                to="/household"
                className="block text-sm lg:text-lg py-1 md:py-2 px-2 md:px-4 text-white hover:text-black 
                           font-medium tracking-wide 
                           transition-all duration-300 
                           hover:bg-white
                           rounded-lg"
                onClick={closeDropdown}
              >
                Household
              </Link>
            </li>

            {/* Shopping Carts Dropdown */}
            <li className="relative">
              <button
                onClick={() => toggleDropdown('carts')}
                className="block text-sm lg:text-lg py-1 md:py-2 px-2 md:px-4 text-white hover:text-black 
                           font-medium tracking-wide 
                           transition-all duration-300 
                           hover:bg-white
                           rounded-lg"
              >
                Shopping Carts
              </button>
              {isDropdownOpen.carts && (
                <ul className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg w-40">
                  <li>
                    <Link
                      to="/household/carts-active"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={closeDropdown}
                    >
                      Active Carts
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/household/carts-history"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={closeDropdown}
                    >
                      History
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Recipes Dropdown */}
            <li className="relative">
              <button
                onClick={() => toggleDropdown('recipes')}
                className="block text-sm lg:text-lg py-1 md:py-2 px-2 md:px-4 text-white hover:text-black 
                           font-medium tracking-wide 
                           transition-all duration-300 
                           hover:bg-white
                           rounded-lg"
              >
                Recipes
              </button>
              {isDropdownOpen.recipes && (
                <ul className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg w-40">
                  <li>
                    <Link
                      to="/household/recipes/create-new"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={closeDropdown}
                    >
                      Create
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/household/recipes"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={closeDropdown}
                    >
                      All Recipes
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link
                to="/profile"
                className="block text-sm lg:text-lg py-1 md:py-2 px-2 md:px-4 text-white hover:text-black 
                           font-medium tracking-wide 
                           transition-all duration-300 
                           hover:bg-white
                           rounded-lg"
                onClick={closeDropdown}
              >
                Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Authentication Buttons */}
        <div className="flex items-center gap-2 md:gap-4">
          <div
            className={`hidden md:flex items-center gap-2 md:gap-4 
                      ${isAuth ? 'bg-rose-600 text-white' : 'border-2 border-white text-white'} 
                      rounded-lg 
                      px-2 md:px-4 py-1 md:py-2
                      hover:px-3 md:hover:px-6
                      shadow-md 
                      hover:shadow-lg 
                      transition-all 
                      duration-300`}
          >
            {isAuth ? (
              <button
                onClick={handleSignOut}
                className="hover:text-white flex gap-2 justify-center items-center font-semibold"
              >
                Sign Out
                <PiSignOut size={20} />
              </button>
            ) : (
              <>
                <Link
                  to="/auth/sign-up"
                  className="pr-2 md:pr-4 border-r 
                  hover:text-black 
                           font-semibold 
                           transition-colors"
                >
                  Sign Up
                </Link>
                <Link
                  to="/auth/sign-in"
                  className="hover:text-black 
                             font-semibold 
                             transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            type="button"
            className="p-2 w-10 h-10 flex items-center justify-center 
                       text-white
                       rounded-full 
                       hover:bg-green-300 
                       focus:outline-none 
                       focus:ring-2 
                       focus:ring-green-400 
                       md:hidden"
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-green-900 via-green-700 to-green-800 w-full py-2 absolute left-0 z-50">
          <ul className="flex flex-col items-center gap-2">
            <li>
              <Link
                to="/household"
                className="block text-base py-2 px-4 text-white hover:text-black 
                           font-medium tracking-wide text-center
                           transition-all duration-300 
                           hover:bg-white
                           rounded-lg"
                onClick={handleLinkClick}
              >
                Household
              </Link>
            </li>
            <li>
              <button
                onClick={() => toggleDropdown('carts')}
                className="block text-base py-2 px-4 text-white hover:text-black 
                           font-medium tracking-wide text-center
                           transition-all duration-300 
                           hover:bg-white
                           rounded-lg"
              >
                Shopping Carts
              </button>
              {isDropdownOpen.carts && (
                <ul className="bg-white shadow-lg rounded-lg w-40 mt-2">
                  <li>
                    <Link
                      to="/household/carts-active"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLinkClick}
                    >
                      Active Carts
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/household/carts-history"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLinkClick}
                    >
                      History
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                onClick={() => toggleDropdown('recipes')}
                className="block text-base py-2 px-4 text-white hover:text-black 
                           font-medium tracking-wide text-center
                           transition-all duration-300 
                           hover:bg-white
                           rounded-lg"
              >
                Recipes
              </button>
              {isDropdownOpen.recipes && (
                <ul className="bg-white shadow-lg rounded-lg w-40 mt-2">
                  <li>
                    <Link
                      to="/household/recipes/create-new"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLinkClick}
                    >
                      Create
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/household/recipes"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLinkClick}
                    >
                      All Recipes
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link
                to="/profile"
                className="block text-base py-2 px-4 text-white hover:text-black 
                           font-medium tracking-wide text-center
                           transition-all duration-300 
                           hover:bg-white
                           rounded-lg"
                onClick={handleLinkClick}
              >
                Profile
              </Link>
            </li>
            
            {/* Mobile Sign Out Button */}
            {isAuth && (
              <li className="border-t border-green-600 pt-2 mt-2 w-full">
                <button
                  onClick={handleSignOut}
                  className="flex gap-2 justify-center items-center text-base py-2 px-4 text-white hover:text-black 
                             font-medium tracking-wide text-center
                             transition-all duration-300 
                             hover:bg-white
                             rounded-lg
                             w-full"
                >
                  Sign Out
                  <PiSignOut size={20} />
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default NavBar;