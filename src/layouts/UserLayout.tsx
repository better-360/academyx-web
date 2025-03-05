import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, GraduationCap, Bell } from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { logOut } from '../store/slices/userSlice';
import { removeTokens } from '../utils/storage';

const UserLayout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      dispatch(logOut())
      removeTokens();
      navigate('/user/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center flex-shrink-0">
                <GraduationCap className="w-8 h-8 text-primary" />
                <span className="ml-2 text-xl font-bold text-primary-darker">
                  AcademyX
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-gray-100 transition-colors relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 transform translate-x-1/2 -translate-y-1/2"></span>
              </button>
              
              <div className="border-l h-6 border-gray-200 mx-2"></div>
              
              <button
                onClick={()=>handleLogout}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} AcademyX. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-sm text-gray-500 hover:text-primary">
                Gizlilik Politikası
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-primary">
                Kullanım Şartları
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-primary">
                Yardım
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;