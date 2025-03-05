import { useState, useEffect } from "react";
import { GraduationCap, Plus, Pencil, Trash2, X, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteSurvey, getAllSurveys } from "../../http/requests/admin";

const Courses = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSurveys = async () => {
    setLoading(true);
    setError(null);
    try {
      const surveysData = await getAllSurveys();
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

  const handleDeleteSurvey = async (id: string) => {
    if (
      window.confirm("Bu değerlendirmeyi silmek istediğinizden emin misiniz?")
    ) {
      setLoading(true);
      try {
        // Delete survey
        await deleteSurvey(id);
        await fetchSurveys();
      } catch (error) {
        console.error("Error deleting course:", error);
        setError("Değerlendirme silinirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-darker flex items-center">
            <GraduationCap className="w-8 h-8 mr-2" />
            Değerlendirme Yönetimi
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Toplam {surveys.length} değerlendirme
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/courses/new")}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-dark transition-colors"
          disabled={loading}
        >
          <Plus className="w-5 h-5 mr-2" />
          Yeni Değerlendirme
        </button>
      </div>

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
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/admin/courses/${survey.id}/edit`)}
                    className="text-gray-600 hover:text-primary transition-colors"
                    disabled={loading}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSurvey(survey.id)}
                    className="text-gray-600 hover:text-red-500 transition-colors"
                    disabled={loading}
                  >
                    <Trash2 className="w-5 h-5" />
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

export default Courses;
