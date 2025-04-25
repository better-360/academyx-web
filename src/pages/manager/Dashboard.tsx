import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Brain,
  Target,
  TrendingUp,
  Calendar,
  Eye,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useAppSelector } from "../../store/hooks";
import { getManagerSurveys, getMyCompanySurveys } from "../../http/requests/companyRequests";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [managerSurveys, setManagerSurveys] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userData=useAppSelector((state)=>state.user.userData);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const surveys=await getMyCompanySurveys();
      const managerS=await getManagerSurveys()
      setManagerSurveys(managerS);
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
    <div>
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Hoş Geldin, {userData.firstName}!
            </h2>
            <p className="mt-1 text-gray-600">
              Değerlendirme platformunda seni görmekten mutluluk duyuyoruz
            </p>
          </div>
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80"
              alt="Dashboard illustration"
              className="h-24 w-auto rounded-lg object-cover"
            />
          </div>
        </div>
      </div>

      {/* Pending Surveys Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Bekleyen Anketler</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className="relative bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      survey.status,
                      survey.dueDate
                    )}`}
                  >
                    {getStatusText(survey.status, survey.dueDate)}
                  </span>
                </div>

                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {survey.title}
                </h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      Atanma:{" "}
                      {new Date(survey.assignedAt).toLocaleDateString(
                        "tr-TR"
                      )}
                    </span>
                  </div>
                  {survey.dueDate && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>
                        Son Tarih:{" "}
                        {new Date(survey.dueDate).toLocaleDateString(
                          "tr-TR"
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {survey.status !== "completed" && (
                  <button
                    onClick={() =>
                      navigate(`/manager/assessments/${survey.id}`)
                    }
                    className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                  Gözden Geçir
                  </button>
                )}
              </div>
            </div>
          ))}

          {managerSurveys.map((survey) => (
            <div
              key={survey.id}
              className="relative bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      survey.status,
                      survey.dueDate
                    )}`}
                  >
                    {getStatusText(survey.status, survey.dueDate)}
                  </span>
                </div>

                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {survey.title}
                </h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      Atanma:{" "}
                      {new Date(survey.createdAt).toLocaleDateString(
                        "tr-TR"
                      )}
                    </span>
                  </div>
                  {survey.dueDate && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>
                        Son Tarih:{" "}
                        {new Date(survey.dueDate).toLocaleDateString(
                          "tr-TR"
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {survey.status !== "completed" && (
                  <button
                    onClick={() =>
                      navigate(`/manager/manager-assessment/${survey.id}`)
                    }
                    className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Değerlendirmeyi Başlat
                  </button>
                )}
              </div>
            </div>
          ))}

          {surveys.length === 0 && managerSurveys.length === 0 && (
            <div className="col-span-full">
              <div className="text-center py-12">
                <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Henüz değerlendirmeniz yok
                </h3>
                <p className="text-gray-600">
                  Size atanan değerlendirmeler burada görüntülenecektir.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;