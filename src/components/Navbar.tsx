import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, LogOut, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const NavLinks = () => (
    <>
      <Link
        to="/"
        className="relative text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-all duration-300 font-medium group"
      >
        Home
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
      </Link>

      {isAuthenticated ? (
        <>
          <Link
            to="/create-post"
            className="relative text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-all duration-300 font-medium group"
          >
            Create Post
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/profile/1"
            className="relative text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-all duration-300 font-medium group"
          >
            Profile
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-all duration-300 font-medium p-0 h-auto hover:bg-red-50 dark:hover:bg-red-950/20 px-2 py-1 rounded-md"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="relative text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-all duration-300 font-medium group"
          >
            Login
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/signup"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="glass backdrop-blur-xl border-b border-white/20 dark:border-gray-800/50 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 animate-float">
              <Sparkles className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-glow"></div>
            </div>
            <span className="text-xl sm:text-2xl font-bold gradient-text">BlogApp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLinks />
            {isAuthenticated && user && (
              <div className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-full border border-blue-200 dark:border-blue-800">
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  Welcome, {user.name}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-3 flex-shrink-0">
            <div className="relative group">
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-white/80 dark:bg-gray-800/80 border border-gray-300/50 dark:border-gray-700/50 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:shadow-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-hover:text-blue-500 transition-colors duration-300" />
            </div>
            <Button
              type="submit"
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-6 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Search
            </Button>
          </form>

          {/* Mobile controls */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="hidden sm:block lg:hidden">
              <ThemeToggle />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden glass hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-80 glass backdrop-blur-xl">
                <div className="flex flex-col space-y-8 mt-8">
                  <div className="flex flex-col space-y-6">
                    <NavLinks />
                  </div>
                  {isAuthenticated && user && (
                    <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                      <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          Welcome, {user.name}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    <ThemeToggle />
                  </div>
                  <form onSubmit={handleSearch} className="flex flex-col space-y-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    <Input
                      type="text"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/80 dark:bg-gray-800/80 border border-gray-300/50 dark:border-gray-700/50 rounded-full"
                    />
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full rounded-full transform hover:scale-105 transition-all duration-300"
                    >
                      Search
                    </Button>
                  </form>
                </div>
              </SheetContent>
            </Sheet>
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
