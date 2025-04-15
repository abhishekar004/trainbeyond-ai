
import React from 'react';
import { Dumbbell } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="workout-gradient text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Dumbbell className="h-8 w-8" />
          <h1 className="text-2xl font-bold">FitFlow AI</h1>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><a href="#" className="hover:text-gray-200 transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-gray-200 transition-colors">Workouts</a></li>
            <li><a href="#" className="hover:text-gray-200 transition-colors">Exercises</a></li>
            <li><a href="#" className="hover:text-gray-200 transition-colors">About</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
