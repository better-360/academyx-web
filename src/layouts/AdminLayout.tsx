import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Users, GraduationCap, ClipboardList, LogOut, BarChart, BookOpen } from 'lucide-react';
import { logOut } from '../store/slices/userSlice';
import { useAppDispatch } from '../store/hooks';
import { removeTokens } from '../utils/storage';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const navigation = [
    { name: 'Dashboard', icon: BarChart, href: '/admin', current: location.pathname === '/admin' },
    { name: 'Şirketler', icon: Building2, href: '/admin/companies', current: location.pathname.startsWith('/admin/companies') },
    { name: 'Kullanıcılar', icon: Users, href: '/admin/users', current: location.pathname === '/admin/users' },
    { name: 'Değerlendirmeler', icon: GraduationCap, href: '/admin/courses', current: location.pathname.startsWith('/admin/courses') },
    { name: 'Atamalar', icon: ClipboardList, href: '/admin/assignments', current: location.pathname === '/admin/assignments' },
    { name: 'Sonuçlar', icon: BarChart, href: '/admin/results', current: location.pathname === '/admin/results' },
  ];

  const handleLogout = async () => {
    try {
      dispatch(logOut());
      removeTokens();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-semibold text-gray-900">AcademyX</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      item.current
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                <LogOut className="mr-3 h-6 w-6 text-gray-400" />
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;