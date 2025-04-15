
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dumbbell, Home, BarChart2, Info } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? "text-primary" : "text-white hover:text-gray-200";
  };

  return (
    <header className="workout-gradient text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Dumbbell className="h-8 w-8" />
          <h1 className="text-2xl font-bold">FitFlow AI</h1>
        </Link>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className={`flex items-center space-x-1 transition-colors ${isActive('/')}`}>
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/workouts" className={`flex items-center space-x-1 transition-colors ${isActive('/workouts')}`}>
                <Dumbbell className="h-4 w-4" />
                <span>Workouts</span>
              </Link>
            </li>
            <li>
              <Link to="/exercises" className={`flex items-center space-x-1 transition-colors ${isActive('/exercises')}`}>
                <BarChart2 className="h-4 w-4" />
                <span>Exercises</span>
              </Link>
            </li>
            <li>
              <Link to="/about" className={`flex items-center space-x-1 transition-colors ${isActive('/about')}`}>
                <Info className="h-4 w-4" />
                <span>About</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
