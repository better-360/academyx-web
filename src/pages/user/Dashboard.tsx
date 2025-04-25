import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  ClipboardList,
  Calendar,
  Eye,
} from "lucide-react";
import { useAppSelector } from "../../store/hooks";
import { getMyCompanySurveys } from "../../http/requests/companyRequests";

const Dashboard = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userData = useAppSelector((state) => state.user.userData);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const surveys = await getMyCompanySurveys();
      setSurveys(surveys);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching surveys:", error);
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
                Değerlendirme platformuna hoş geldiniz.
              </p>
            </div>
          </div>
        </div>

        {/* Pending Surveys Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Bekleyen Anketler</h3>
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
                      <Eye className="w-4 h-4 mr-2" />
                      Ankete Başla
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {surveys.filter(s => s.status !== 'completed').length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Bekleyen anketiniz bulunmamaktadır.</p>
              </div>
            )}
          </div>
        </div>

        {/* Completed Surveys Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tamamlanan Anketler</h3>
          </div>

          <div className="space-y-4">
            {surveys.filter(s => s.status === 'completed').map((survey) => (
              <div
                key={survey.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="sm:flex sm:items-center sm:justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">{survey.title}</h4>
                    <div className="mt-1 sm:flex sm:items-center sm:space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(survey.completedAt || survey.updatedAt), 'd MMMM yyyy', { locale: tr })}
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        Tamamlandı
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {surveys.filter(s => s.status === 'completed').length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Henüz tamamlanmış anketiniz bulunmamaktadır.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;