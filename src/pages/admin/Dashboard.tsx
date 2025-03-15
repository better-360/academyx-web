import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  ClipboardList,
  BarChart,
  AlertCircle,
  Search,
  Plus,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllCompanines, getAllCustomSurveys, getAllResults } from '../../http/requests/admin';

interface DashboardStats {
  totalCompanies: number;
  totalUsers: number;
  activeSurveys: number;
  completionRate: number;
  recentActivity: Array<{
    id: string;
    type: 'company' | 'survey' | 'user';
    action: string;
    date: string;
    details: string;
  }>;
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalCompanies: 0,
    totalUsers: 0,
    activeSurveys: 0,
    completionRate: 0,
    recentActivity: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [companies, surveys, results] = await Promise.all([
        getAllCompanines(),
        getAllCustomSurveys(),
        getAllResults(),
      ]);

      setStats({
        totalCompanies: companies.length,
        totalUsers: companies.reduce((acc, company) => acc + (company.userCount || 0), 0),
        activeSurveys: surveys.length,
        completionRate: calculateCompletionRate(results),
        recentActivity: generateRecentActivity(companies, surveys),
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletionRate = (results: any[]): number => {
    if (!results.length) return 0;
    const completed = results.filter(r => r.status === 'completed').length;
    return Math.round((completed / results.length) * 100);
  };

  const generateRecentActivity = (companies: any[], surveys: any[]) => {
    const activity = [
      ...companies.slice(0, 3).map(company => ({
        id: company.id,
        type: 'company' as const,
        action: 'Yeni şirket kaydı',
        date: new Date().toISOString(),
        details: company.name,
      })),
      ...surveys.slice(0, 3).map(survey => ({
        id: survey.id,
        type: 'survey' as const,
        action: 'Yeni anket oluşturuldu',
        date: new Date().toISOString(),
        details: survey.title,
      })),
    ];
    return activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="ml-3 text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AcademyX Yönetim Paneli</h1>
              <p className="mt-1 text-gray-600">
                Sistem genelinde {stats.totalCompanies} şirket ve {stats.totalUsers} kullanıcı bulunuyor
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/admin/companies/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
              >
                <Plus className="h-5 w-5 mr-2" />
                Yeni Şirket
              </Link>
              <Link
                to="/admin/courses/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
              >
                <Plus className="h-5 w-5 mr-2" />
                Yeni Anket
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Şirket</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCompanies}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ClipboardList className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif Anketler</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeSurveys}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <BarChart className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tamamlanma Oranı</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completionRate}%</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h2>
              <button className="text-sm text-primary hover:text-primary-dark">
                Tümünü Gör
              </button>
            </div>

            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
                >
                  <div
                    className={`p-2 rounded-lg mr-4 ${
                      activity.type === 'company'
                        ? 'bg-blue-100'
                        : activity.type === 'survey'
                        ? 'bg-purple-100'
                        : 'bg-green-100'
                    }`}
                  >
                    {activity.type === 'company' ? (
                      <Building2 className="h-5 w-5 text-blue-600" />
                    ) : activity.type === 'survey' ? (
                      <ClipboardList className="h-5 w-5 text-purple-600" />
                    ) : (
                      <Users className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.details}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(activity.date).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Companies Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Şirketler</h2>
              <Link
                to="/admin/companies"
                className="text-sm text-primary hover:text-primary-dark flex items-center"
              >
                Tümünü Gör
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Şirket ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="space-y-4">
              {stats.recentActivity
                .filter((activity) => activity.type === 'company')
                .map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{company.details}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(company.date).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/admin/companies/${company.id}`}
                      className="text-sm text-primary hover:text-primary-dark"
                    >
                      Detaylar
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;