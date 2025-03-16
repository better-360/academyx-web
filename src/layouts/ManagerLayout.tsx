import { useState } from "react";
import {
  BookOpen,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  ClipboardList,
  HelpCircle
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { logOut } from '../store/slices/userSlice';
import { removeTokens } from '../utils/storage';

const ManagerLayout = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userData = useAppSelector((state) => state.user.userData);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const navigation = [
    { 
      name: 'Dashboard', 
      icon: LayoutDashboard, 
      href: '/manager', 
      current: location.pathname === '/manager' 
    },
    { 
      name: 'Anketlerim', 
      icon: ClipboardList, 
      href: '/manager/assessments', 
      current: location.pathname.startsWith('/manager/assessments') 
    },
    { 
      name: 'Personelim', 
      icon: ClipboardList, 
      href: '/manager/personnel',
      current: location.pathname.startsWith('/manager/personnel') 
    },
    { 
      name: 'Sonuçlar', 
      icon: HelpCircle, 
      href: '/manager/results', 
      current: location.pathname.startsWith('/manager/results') 
    },
        { 
      name: 'Yardım', 
      icon: HelpCircle, 
      href: '/manager/help', 
      current: location.pathname.startsWith('/manager/help') 
    },
  ];

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
      {/* Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            <div className="flex items-center h-16 flex-shrink-0 px-6 border-b border-gray-200">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="ml-3 text-xl font-semibold text-gray-900">AcademyX</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-4 py-6 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      item.current
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${
                      item.current ? 'text-white' : 'text-gray-400'
                    }`} />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <h1 className="text-lg font-semibold text-gray-900">
              {navigation.find(item => item.current)?.name || 'Dashboard'}
            </h1>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              
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
                    <Link to="/user/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Profil
                      </div>
                    </Link>
                    <Link to="/user/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Ayarlar
                      </div>
                    </Link>
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

export default ManagerLayout;