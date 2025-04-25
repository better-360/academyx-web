import { useState } from "react";
import {
  User,
  LogOut,
  ChevronDown,
  BookOpen
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { useNavigate, Outlet } from 'react-router-dom';
import { logOut } from '../store/slices/userSlice';
import { removeTokens } from '../utils/storage';

const UserLayout = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userData = useAppSelector((state) => state.user.userData);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      dispatch(logOut());
      removeTokens();
      navigate('/user/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="ml-3 text-xl font-semibold text-gray-900">AcademyX</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{userData?.firstName || 'Kullanıcı'}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Çıkış Yap
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;