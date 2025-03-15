import { useState, useEffect } from "react";
import { X, BookOpen, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyCompanySurveys } from "../../http/requests/companyRequests";

const UserAssessments = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSurveys = async () => {
    setLoading(true);
    setError(null);
    try {
      const surveysData = await getMyCompanySurveys();
      setSurveys(surveysData);
    } catch (error) {
      console.error("Error fetching surveys:", error);
      setError("Veri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);


  return (
    <div className="container mx-auto px-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey) => (
            <div key={survey.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 text-primary mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-primary-darker">
                      {survey.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {survey.questions.length} soru
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <button
                    onClick={() => navigate(`/user/assessments/${survey.id}`)}
                    className="text-gray-600 hover:text-primary transition-colors"
                    disabled={loading}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {survey.description && (
                <p className="mt-4 text-sm text-gray-600">
                  {survey.description}
                </p>
              )}
            </div>
          ))}
          {surveys.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              Henüz değerlendirme eklenmemiş.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAssessments;
