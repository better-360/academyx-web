import { useState, useEffect } from "react";
import {
  BarChart,
  PieChart,
  Users,
  Building2,
  AlertCircle,
} from "lucide-react";
import {
  getAllCompanines,
  getAllCustomSurveys,
  getAllSurveys,
  getSurveyResults,
} from "../../http/requests/admin";

interface AssessmentResult {
  courseId: string;
  courseName: string;
  companyId: string;
  companyName: string;
  totalUsers: number;
  completedCount: number;
  pendingCount: number;
  answers: {
    questionIndex: number;
    questionText: string;
    optionCounts: { [key: string]: number };
  }[];
}

const Results = () => {
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [companies, setCompanies] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [customSurveys, setCustomSurveys] = useState<any[]>([]);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const companiesData = await getAllCompanines();
      setCompanies(companiesData);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Veri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

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

  const fetchCustomSurveys = async () => {
    setLoading(true);
    setError(null);
    try {
      const customSurveysData = await getAllCustomSurveys();
      setCustomSurveys(customSurveysData);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Veri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const resultsData = await getSurveyResults(id);
      setResults(resultsData);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Veri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchSurveys();
    fetchCustomSurveys();
    fetchResults(selectedCompanyId);
  }, [selectedCompanyId]);

  const getCompletionPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getAnswerPercentage = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-darker flex items-center">
            <BarChart className="w-8 h-8 mr-2" />
            Değerlendirme Sonuçları
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Tüm değerlendirmelerin detaylı analizi
          </p>
        </div>
        <div>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Tüm Şirketler</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {results.map((result) => (
          <div
            key={`${result.courseId}-${result.companyId}`}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-primary-darker">
                    {result.courseName}
                  </h2>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Building2 className="w-4 h-4 mr-1" />
                    <span className="text-sm">{result.companyName}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {result.totalUsers} kullanıcı
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">
                    Tamamlanma Durumu
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Tamamlanan</span>
                    <span className="text-sm font-medium text-green-600">
                      {result.completedCount} / {result.totalUsers}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{
                        width: `${getCompletionPercentage(
                          result.completedCount,
                          result.totalUsers
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-500 text-right">
                    {getCompletionPercentage(
                      result.completedCount,
                      result.totalUsers
                    )}
                    %
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">
                    Bekleyen Kullanıcılar
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Bekleyen</span>
                    <span className="text-sm font-medium text-yellow-600">
                      {result.pendingCount} / {result.totalUsers}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-yellow-500 h-2.5 rounded-full"
                      style={{
                        width: `${getCompletionPercentage(
                          result.pendingCount,
                          result.totalUsers
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-500 text-right">
                    {getCompletionPercentage(
                      result.pendingCount,
                      result.totalUsers
                    )}
                    %
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Soru Bazlı Analiz
                </h3>
                {result.answers.map((answer, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-4">
                      {index + 1}. {answer.questionText}
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(answer.optionCounts).map(
                        ([option, count]) => (
                          <div key={option}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-600">
                                {option}
                              </span>
                              <span className="text-sm font-medium text-primary">
                                {count} cevap
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{
                                  width: `${getAnswerPercentage(
                                    count,
                                    result.completedCount
                                  )}%`,
                                }}
                              />
                            </div>
                            <div className="mt-1 text-xs text-gray-500 text-right">
                              {getAnswerPercentage(
                                count,
                                result.completedCount
                              )}
                              %
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {results.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Henüz sonuç bulunmuyor
            </h3>
            <p className="text-gray-600">
              Tamamlanan değerlendirmeler burada görüntülenecektir.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
