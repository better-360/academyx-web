import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, X, HelpCircle } from "lucide-react";
import { getCustomSurvey } from "../../http/requests/admin";

interface Question {
  text: string;
  options: string[];
}

const AssessmentsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<{
    title: string;
    description: string;
    questions: Question[];
  }>({
    title: "",
    description: "",
    questions: [],
  });

  useEffect(() => {
    if (id) {
      fetchCustomSurvey(id);
    }
  }, [id]);

  const fetchCustomSurvey = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const surveysData = await getCustomSurvey(id);
      setAssessment({
        title: surveysData.title || "",
        description: surveysData.description || "",
        questions: Array.isArray(surveysData.questions)
          ? surveysData.questions
          : [],
      });
    } catch (error) {
      console.error("Error fetching survey:", error);
      setError("Değerlendirme bilgileri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <button
        onClick={() => navigate("/admin/assignments", { replace: true })}
        className="flex items-center text-gray-600 hover:text-primary mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Değerlendirmelere Dön
      </button>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-primary-darker mb-6">
          Değerlendirme Detayları
        </h1>

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
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-2">
                Değerlendirme Adı
              </h2>
              <p className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
                {assessment.title}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </h2>
              <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200 min-h-[80px]">
                {assessment.description ? (
                  <p>{assessment.description}</p>
                ) : (
                  <p className="text-gray-400 italic">Açıklama bulunmuyor</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-4">
                Sorular ({assessment.questions?.length || 0})
              </h2>

              {assessment.questions && assessment.questions.length > 0 ? (
                <div className="space-y-4">
                  {assessment.questions.map((question, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center mb-2">
                        <span className="text-sm text-gray-500 mr-2">
                          {index + 1}.
                        </span>
                        <p className="font-medium">{question.text}</p>
                      </div>
                      <div className="ml-7 space-y-1">
                        {question.options && Array.isArray(question.options) ? (
                          question.options.map((option, optionIndex) => (
                            <p
                              key={optionIndex}
                              className="text-sm text-gray-600 flex items-center"
                            >
                              <span className="w-6">
                                {String.fromCharCode(65 + optionIndex)}
                              </span>
                              {option}
                            </p>
                          ))
                        ) : (
                          <p className="text-gray-400 italic">
                            Seçenek bulunmuyor
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Henüz soru eklenmemiş</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentsDetails;