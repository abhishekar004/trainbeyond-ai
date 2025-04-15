
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dumbbell, Home, BarChart2, Info, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path ? "text-primary" : "text-white hover:text-gray-200";
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <header className="workout-gradient text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Dumbbell className="h-8 w-8" />
          <h1 className="text-2xl font-bold">FitFlow AI</h1>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`flex items-center space-x-1 transition-colors ${isActive('/')}`}>
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link to="/workouts" className={`flex items-center space-x-1 transition-colors ${isActive('/workouts')}`}>
            <Dumbbell className="h-4 w-4" />
            <span>Workouts</span>
          </Link>
          <Link to="/exercises" className={`flex items-center space-x-1 transition-colors ${isActive('/exercises')}`}>
            <BarChart2 className="h-4 w-4" />
            <span>Exercises</span>
          </Link>
          <Link to="/about" className={`flex items-center space-x-1 transition-colors ${isActive('/about')}`}>
            <Info className="h-4 w-4" />
            <span>About</span>
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-white" onClick={() => navigate('/profile')}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="ghost" size="sm" className="text-white" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" className="text-white" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
