import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
} from "lucide-react";
import { getUserData } from "../../http/requests";
import { setUserData } from "../../store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import instance from "../../http/instance";

const Dashboard = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userData=useAppSelector((state)=>state.user.userData);

  
  const dispatch = useAppDispatch();
  useEffect(() => {
    fetchUserData();
    fetchSurveys();
  }, []);

  const fetchUserData = async () => {
    const userdata = await getUserData();
    dispatch(setUserData(userdata));
  };
  

  const fetchSurveys = async () => {
    const surveys=await instance.get(`/companies/${userData.companyId}/surveys`);
    setSurveys(surveys.data);
    setLoading(false);
  };

  const getStatusColor = (status: string, dueDate?: string) => {
    if (status === "completed")
      return "bg-green-100 text-green-800 border-green-200";
    if (dueDate && new Date(dueDate) < new Date())
      return "bg-red-100 text-red-800 border-red-200";
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getStatusText = (status: string, dueDate?: string) => {
    if (status === "completed") return "Tamamlandı";
    if (dueDate && new Date(dueDate) < new Date()) return "Süresi Doldu";
    return "Bekliyor";
  };

  const getStatusIcon = (status: string, dueDate?: string) => {
    if (status === "completed") return <CheckCircle className="w-5 h-5" />;
    if (dueDate && new Date(dueDate) < new Date())
      return <AlertCircle className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const completedCount = surveys.filter(
    (a) => a.status === "completed"
  ).length;
  const pendingCount = surveys.filter((a) => a.status === "pending").length;

  return (
    <div>
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary-darker">
              Hoş Geldin, {userData.firstName}
            </h1>
            <p className="text-gray-600 mt-1">
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
              <ClipboardList className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Toplam Değerlendirme
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {surveys.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
              <p className="text-2xl font-semibold text-gray-900">
                {completedCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bekleyen</p>
              <p className="text-2xl font-semibold text-gray-900">
                {pendingCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* surveys Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Değerlendirmelerim
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Tamamlanan
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              Bekleyen
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Süresi Dolan
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {surveys.map((assessment) => (
            <div
              key={assessment.id}
              className="relative bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      assessment.status,
                      assessment.dueDate
                    )}`}
                  >
                    {getStatusText(assessment.status, assessment.dueDate)}
                  </span>
                </div>

                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {assessment.courseName}
                </h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      Atanma:{" "}
                      {new Date(assessment.assignedAt).toLocaleDateString(
                        "tr-TR"
                      )}
                    </span>
                  </div>
                  {assessment.dueDate && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>
                        Son Tarih:{" "}
                        {new Date(assessment.dueDate).toLocaleDateString(
                          "tr-TR"
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {assessment.status !== "completed" && (
                  <button
                    onClick={() =>
                      navigate(`/user/assessment/${assessment.id}`)
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

          {surveys.length === 0 && (
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

export default Dashboard;
