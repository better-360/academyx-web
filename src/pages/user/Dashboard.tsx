import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  BarChart as ChartIcon,
  Clock,
  CheckCircle,
  ChevronRight,
  BookOpen,
  Brain,
  Target,
  TrendingUp,
  Calendar,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  GraduationCap,
  ClipboardList,
  HelpCircle
} from "lucide-react";
import { getUserData } from "../../http/requests";
import { setUserData } from "../../store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getMyCompanySurveys } from "../../http/requests/companyRequests";

const Dashboard = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userData = useAppSelector((state) => state.user.userData);
  const dispatch = useAppDispatch();

  // Mock data for demonstration
  const mockStats = {
    weeklyCompletedSurveys: 3,
    totalPendingSurveys: 5,
    completionRate: 75,
    weeklyTarget: 5
  };

  useEffect(() => {
    fetcSurveys();
  }, []);

  const fetcSurveys = async () => {
    try {
      setLoading(true);
      const surveys = await getMyCompanySurveys();
      setSurveys(surveys);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Anketler yüklenirken bir hata oluştu.");
      setLoading(false);
    }
  };




  const getStatusColor = (status: string, dueDate?: string) => {
    if (status === "completed") return "bg-emerald-100 text-emerald-800";
    if (dueDate && new Date(dueDate) < new Date()) return "bg-red-100 text-red-800";
    return "bg-blue-100 text-blue-800";
  };

  const getStatusText = (status: string, dueDate?: string) => {
    if (status === "completed") return "Tamamlandı";
    if (dueDate && new Date(dueDate) < new Date()) return "Süresi Doldu";
    return "Bekliyor";
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Hoş Geldin, {userData.firstName}!
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Bu hafta {mockStats.weeklyCompletedSurveys} anket tamamladın. Hedefe ulaşmana {mockStats.weeklyTarget - mockStats.weeklyCompletedSurveys} anket kaldı.
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  Haftalık Hedef: {mockStats.weeklyTarget} Anket
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ChartIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tamamlama Oranı</p>
                  <p className="text-2xl font-semibold text-gray-900">{mockStats.completionRate}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Bu Hafta Tamamlanan</p>
                  <p className="text-2xl font-semibold text-gray-900">{mockStats.weeklyCompletedSurveys}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Bekleyen Anketler</p>
                  <p className="text-2xl font-semibold text-gray-900">{mockStats.totalPendingSurveys}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Gelişim Puanı</p>
                  <p className="text-2xl font-semibold text-gray-900">85</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Surveys Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Bekleyen Anketler</h3>
              <a href="#" className="text-sm text-primary hover:text-primary-dark flex items-center">
                Tümünü Gör
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>

            <div className="space-y-4">
              {surveys.filter(s => s.status !== 'completed').map((survey) => (
                <div
                  key={survey.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                >
                  <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                      <h4 className="text-base font-medium text-gray-900">{survey.title}</h4>
                      <div className="mt-1 sm:flex sm:items-center sm:space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(survey.dueDate), 'd MMMM yyyy', { locale: tr })}
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            getStatusColor(survey.status, survey.dueDate)
                          }`}
                        >
                          {getStatusText(survey.status, survey.dueDate)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <button
                        onClick={() => navigate(`/user/assessments/${survey.id}`)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Ankete Başla
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Brain className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Yapay Zeka Önerileri</h3>
              </div>
              <a href="#" className="text-sm text-primary hover:text-primary-dark flex items-center">
                Tüm Öneriler
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {surveys.map((survey) => (
                <div
                  key={survey.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <h4 className="text-base font-medium text-gray-900">{survey.title}</h4>
                      <p className="mt-1 text-sm text-gray-500">{survey.description}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-xs text-gray-500">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {survey?.duration?? 0} Dakika
                        </span>
                        <span className="text-xs text-primary">
                          {survey?.relevance ?? 0}%
                        </span>
                      </div>
                      <button className="mt-3 text-sm text-primary hover:text-primary-dark font-medium">
                        Eğitime Başla
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
    </div>
  );
};

export default Dashboard;