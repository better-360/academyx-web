import { useState, useEffect } from "react";
import {
  BarChart,
  PieChart,
  Building2,
  AlertCircle,
  ChevronLeft,
  Search,
  Brain,
  Loader2,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  generateReport,
  getAllCompanines,
  getCompanyCustomSurveys,
  getSurveyResults,
} from "../../http/requests/admin";
import toast from "react-hot-toast";

export interface IResponseOption {
  option: string;
  responseCount: number;
}

export interface ISurveyResponses {
  questionId: string;
  question: string;
  responses: IResponseOption[];
}

export interface ISurveyResult {
  responses: ISurveyResponses[];
  reportStatus: string;
}

const Results = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<any>();
  const [surveyResults, setSurveyResults] = useState<ISurveyResult | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchCompanySurveys(selectedCompany.id);
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedSurvey) {
      fetchSurveyResults(selectedSurvey.id);
    }
  }, [selectedSurvey]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await getAllCompanines();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Şirketler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanySurveys = async (companyId: string) => {
    setLoading(true);
    try {
      const data = await getCompanyCustomSurveys(companyId);
      setSurveys(data);
      setSelectedSurvey(null);
      setSurveyResults(null);
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
      const data = await getSurveyResults(surveyId);
      console.log("gelen data", data);
      setSurveyResults(data);
    } catch (error) {
      console.error("Error fetching survey results:", error);
      setError("Anket sonuçları yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (surveyId: string) => {
 try {
  await generateReport(surveyId);
 } catch (error) {
  console.error("Error generating report:", error);
  toast.error("Rapor oluşturulurken bir hata oluştu.");
  setError("Rapor oluşturulurken bir hata oluştu.");
 }
    setSurveyResults(
      (prev) =>
        prev && { ...prev, reportStatus: "processing" }
    );
    // Simulate API call with setTimeout
    setTimeout(() => {
      setSurveyResults(
        (prev) =>
          prev && { ...prev, reportStatus: "completed" }
      );
    }, 5000);
  };

  const handleViewReport = (surveyId: string) => {
    navigate(`/admin/results/${surveyId}/report`);
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {selectedCompany
              ? `${selectedCompany.name} şirketi sonuçları`
              : "Şirket seçiniz"}
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

      {!selectedCompany ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                onClick={() => setSelectedCompany(company)}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-primary cursor-pointer transition-colors"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-primary bg-opacity-10 rounded-lg">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {company.name}
                    </h3>
                    <p className="text-sm text-gray-500">{company.sector}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !selectedSurvey ? (
        <div>
          <button
            onClick={() => setSelectedCompany(null)}
            className="flex items-center text-gray-600 hover:text-primary mb-6"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Şirket Seçimine Dön
          </button>
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
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setSelectedSurvey(null)}
              className="flex items-center text-gray-600 hover:text-primary"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Anket Seçimine Dön
            </button>
            {surveyResults && surveyResults?.reportStatus === "waiting" ? (
              <button
                onClick={() => handleGenerateReport(selectedSurvey.id)}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Brain className="w-5 h-5 mr-2" />
                AI Rapor Üret
              </button>
            ) : surveyResults?.reportStatus === "processing" ? (
              <button
                disabled
                className="flex items-center px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
              >
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Rapor Oluşturuluyor...
              </button>
            ) : surveyResults?.reportStatus === "completed" ? (
              <button
                onClick={() => handleViewReport(selectedSurvey.id)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FileText className="w-5 h-5 mr-2" />
                Raporu Görüntüle
              </button>
            ) : null}
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">{selectedSurvey.title}</h2>
            <div className="space-y-8">
              {surveyResults?.responses.map((result, index) => (
                <div
                  key={result.questionId}
                  className="bg-gray-50 rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    {index + 1}. {result.question}
                  </h3>
                  <div className="space-y-4">
                    {result.responses.map((response) => (
                      <div key={response.option} className="mb-2">
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

export default Results;
