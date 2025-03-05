import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Users, GraduationCap, ClipboardList, LogOut, BarChart } from 'lucide-react';
import { logOut } from '../store/slices/userSlice';
import { useAppDispatch } from '../store/hooks';
import { removeTokens } from '../utils/storage';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logOut());
      removeTokens();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-darker text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">AcademyX</h1>
          <p className="text-sm opacity-75">Admin Panel</p>
        </div>
        
        <nav className="mt-6">
          <Link 
            to="/admin/companies" 
            className={`flex items-center px-6 py-3 ${
              isActive('/admin/companies') 
                ? 'bg-primary-dark text-white' 
                : 'text-gray-300 hover:bg-primary-dark hover:text-white'
            }`}
          >
            <Building2 className="w-5 h-5 mr-3" />
            Şirketler
          </Link>
          <Link 
            to="/admin/users" 
            className={`flex items-center px-6 py-3 ${
              isActive('/admin/users') 
                ? 'bg-primary-dark text-white' 
                : 'text-gray-300 hover:bg-primary-dark hover:text-white'
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Kullanıcılar
          </Link>
          <Link 
            to="/admin/courses" 
            className={`flex items-center px-6 py-3 ${
              isActive('/admin/courses') 
                ? 'bg-primary-dark text-white' 
                : 'text-gray-300 hover:bg-primary-dark hover:text-white'
            }`}
          >
            <GraduationCap className="w-5 h-5 mr-3" />
            Değerlendirmeler
          </Link>
          <Link 
            to="/admin/assignments" 
            className={`flex items-center px-6 py-3 ${
              isActive('/admin/assignments') 
                ? 'bg-primary-dark text-white' 
                : 'text-gray-300 hover:bg-primary-dark hover:text-white'
            }`}
          >
            <ClipboardList className="w-5 h-5 mr-3" />
            Atamalar
          </Link>
          <Link 
            to="/admin/results" 
            className={`flex items-center px-6 py-3 ${
              isActive('/admin/results') 
                ? 'bg-primary-dark text-white' 
                : 'text-gray-300 hover:bg-primary-dark hover:text-white'
            }`}
          >
            <BarChart className="w-5 h-5 mr-3" />
            Sonuçlar
          </Link>
        </nav>

        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center px-6 py-3 text-gray-300 hover:bg-primary-dark hover:text-white transition-colors w-full"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;