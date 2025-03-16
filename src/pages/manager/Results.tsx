import { useState, useEffect } from "react";
import {
  BarChart,
  PieChart,
  AlertCircle,
  ChevronLeft,
  FileText,
} from "lucide-react";
import {
  getMyCompanySurveyResults,
  getMyCompanySurveys,
} from "../../http/requests/companyRequests";
import { useNavigate } from "react-router-dom";

export interface IResponseOption {
  option: string;
  responseCount: number;
}

export interface ISurveyResult {
  questionId: string;
  question: string;
  responses: IResponseOption[];
}

const ManagerResults = () => {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);
  const [surveyResults, setSurveyResults] = useState<ISurveyResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSurveys();
  }, []);

  useEffect(() => {
    if (selectedSurvey) {
      fetchSurveyResults(selectedSurvey.id);
    }
  }, [selectedSurvey]);

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const data = await getMyCompanySurveys();
      setSurveys(data);
    } catch (error) {
      console.error("Error fetching surveys:", error);
      setError("Anketler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSurveyResults = async (surveyId: string) => {
    setLoading(true);
    try {
      const data = await getMyCompanySurveyResults(surveyId);
      setSurveyResults(data);
    } catch (error) {
      console.error("Error fetching survey results:", error);
      setError("Anket sonuçları yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };


  const handleViewReport = (surveyId: string) => {
    navigate(`/manager/results/${surveyId}/report`);
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
            Anket Sonuçları
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {selectedSurvey
              ? `${selectedSurvey.title} sonuçları`
              : "Anket seçiniz"}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {!selectedSurvey ? (
        // Anket Seçim Görünümü
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              onClick={() => setSelectedSurvey(survey)}
              className="bg-white rounded-lg shadow-md p-6 hover:border-primary cursor-pointer transition-colors"
            >
              <div className="flex items-center mb-4">
                <PieChart className="w-6 h-6 text-primary mr-3" />
                <h3 className="text-lg font-semibold">{survey.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{survey.description}</p>
            </div>
          ))}

          {surveys.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              Henüz anket bulunmuyor.
            </div>
          )}
        </div>
      ) : (
        // Anket Sonuçları Görünümü
        <div>
          <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => setSelectedSurvey(null)}
            className="flex items-center text-gray-600 hover:text-primary mb-6"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Anket Seçimine Dön
          </button>

          <button
                onClick={() => handleViewReport(selectedSurvey.id)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FileText className="w-5 h-5 mr-2" />
                Raporu Görüntüle
              </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">{selectedSurvey.title}</h2>

            <div className="space-y-8">
              {surveyResults.map((result, index) => (
                <div
                  key={result.questionId}
                  className="bg-gray-50 rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    {index + 1}. {result.question}
                  </h3>
                  <div className="space-y-4">
                    {result.responses.map((response) => (
                      <div key={response.option}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {response.option}
                          </span>
                          <span className="text-sm text-gray-500">
                            {response.responseCount} cevap
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${
                                (response.responseCount /
                                  result.responses.reduce(
                                    (acc, r) => acc + r.responseCount,
                                    0
                                  )) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerResults;
