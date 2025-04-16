import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Dumbbell } from 'lucide-react';

export function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link 
            to={user ? "/home" : "/"} 
            className="mr-6 flex items-center space-x-2 font-bold hover:text-primary transition-colors"
          >
            <Dumbbell className="h-6 w-6" />
            <span className="font-bold text-lg">TrainBeyond AI</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link 
              to="/workouts" 
              className={`transition-colors hover:text-primary ${
                location.pathname === '/workouts' ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              Workouts
            </Link>
            <Link 
              to="/progress" 
              className={`transition-colors hover:text-primary ${
                location.pathname === '/progress' ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              Progress
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors hover:text-primary ${
                location.pathname === '/about' ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex-1" />
        {user ? (
          <div className="flex items-center space-x-2">
            <Link to="/profile">
              <Button 
                variant={location.pathname === '/profile' ? 'default' : 'ghost'}
                className="transition-colors"
              >
                Profile
              </Button>
            </Link>
            <Button variant="outline" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        ) : (
          <Link to="/auth">
            <Button variant={location.pathname === '/auth' ? 'secondary' : 'default'}>
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
