import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  X,
  HelpCircle,
  GripVertical,
  Copy,
  Pencil,
} from "lucide-react";
import {
  createSurvey,
  getSurvey,
  updateSurvey,
} from "../../http/requests/admin";

interface Question {
  text: string;
  options: string[];
}

interface Course {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

const CourseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    questions: Question[];
  }>({
    title: "",
    description: "",
    questions: [],
  });
  const [newQuestion, setNewQuestion] = useState<Question>({
    text: "",
    options: ["", "", "", ""],
  });
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);
  const [draggedQuestionIndex, setDraggedQuestionIndex] = useState<
    number | null
  >(null);
  useEffect(() => {
    if (id) {
      fetchSurvey(id);
    }
  }, [id]);

  const fetchSurvey = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const surveysData = await getSurvey(id);
      setFormData(surveysData);
    } catch (error) {
      console.error("Error fetching surveys:", error);
      setError("Değerlendirme bilgileri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("formData", formData);
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const surveyData = {
      title: formData.title,
      description: formData.description,
      };

      if (id) {
        await updateSurvey(id, surveyData);
        setLoading(false);
      } else {
        await createSurvey(surveyData);
        setLoading(false);
      }

      navigate("/admin/courses");
    } catch (error) {
      console.error("Error saving course:", error);
      setError("Değerlendirme kaydedilirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate question
      if (!newQuestion.text.trim()) {
        throw new Error("Soru metni boş olamaz.");
      }
      if (newQuestion.options.some((option) => !option.trim())) {
        throw new Error("Tüm şıklar doldurulmalıdır.");
      }

      if (editingQuestionIndex !== null) {
        // Update existing question
        const updatedQuestions = [...formData.questions];
        updatedQuestions[editingQuestionIndex] = newQuestion;
        setFormData((prev) => ({
          ...prev,
          questions: updatedQuestions,
        }));
      } else {
        // Add new question
        setFormData((prev) => ({
          ...prev,
          questions: [...prev.questions, newQuestion],
        }));
      }

      setNewQuestion({
        text: "",
        options: ["", "", "", ""],
      });
      setShowQuestionForm(false);
      setEditingQuestionIndex(null);
    } catch (error: any) {
      setError(error.message || "Soru eklenirken bir hata oluştu.");
    }
  };

  const handleRemoveQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleDuplicateQuestion = (question: Question) => {
    setNewQuestion({
      text: `${question.text} (Kopya)`,
      options: [...question.options],
    });
    setShowQuestionForm(true);
    setEditingQuestionIndex(null);
  };

  const handleMoveQuestion = (fromIndex: number, toIndex: number) => {
    const newQuestions = [...formData.questions];
    const [removed] = newQuestions.splice(fromIndex, 1);
    newQuestions.splice(toIndex, 0, removed);
    setFormData((prev) => ({ ...prev, questions: newQuestions }));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <button
        onClick={() => navigate("/admin/courses")}
        className="flex items-center text-gray-600 hover:text-primary mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Değerlendirmelere Dön
      </button>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-primary-darker mb-6">
          {id ? "Değerlendirme Düzenle" : "Yeni Değerlendirme"}
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Değerlendirme Adı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              placeholder="Değerlendirmenin amacını ve kapsamını açıklayın..."
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Sorular ({formData.questions.length})
              </label>
              <button
                type="button"
                onClick={() => {
                  setEditingQuestionIndex(null);
                  setNewQuestion({
                    text: "",
                    options: ["", "", "", ""],
                  });
                  setShowQuestionForm(true);
                }}
                className="text-primary hover:text-primary-dark flex items-center text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Yeni Soru Ekle
              </button>
            </div>

            <div className="space-y-4">
              {formData.questions.map((question, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between bg-gray-50 p-4 rounded-lg group"
                  draggable
                  onDragStart={() => setDraggedQuestionIndex(index)}
                  onDragEnd={() => setDraggedQuestionIndex(null)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (
                      draggedQuestionIndex !== null &&
                      draggedQuestionIndex !== index
                    ) {
                      handleMoveQuestion(draggedQuestionIndex, index);
                      setDraggedQuestionIndex(index);
                    }
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-sm text-gray-500 mr-2">
                        {index + 1}.
                      </span>
                      <p className="font-medium flex-1">{question.text}</p>
                    </div>
                    <div className="ml-7 space-y-1">
                      {question.options.map((option, optionIndex) => (
                        <p
                          key={optionIndex}
                          className="text-sm text-gray-600 flex items-center"
                        >
                          <span className="w-6">
                            {String.fromCharCode(65 + optionIndex)})
                          </span>
                          {option}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleDuplicateQuestion(question)}
                      className="text-gray-600 hover:text-primary"
                      title="Soruyu Çoğalt"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingQuestionIndex(index);
                        setNewQuestion(question);
                        setShowQuestionForm(true);
                      }}
                      className="text-gray-600 hover:text-primary"
                      title="Düzenle"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(index)}
                      className="text-gray-600 hover:text-red-500"
                      title="Sil"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              {formData.questions.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Henüz soru eklenmemiş</p>
                  <button
                    type="button"
                    onClick={() => setShowQuestionForm(true)}
                    className="mt-2 text-primary hover:text-primary-dark text-sm"
                  >
                    İlk soruyu ekle
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/admin/courses")}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Kaydediliyor...
                </>
              ) : id ? (
                "Güncelle"
              ) : (
                "Ekle"
              )}
            </button>
          </div>
        </form>
      </div>

      {showQuestionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary-darker flex items-center">
                <HelpCircle className="w-6 h-6 mr-2" />
                {editingQuestionIndex !== null
                  ? "Soru Düzenle"
                  : "Yeni Soru Ekle"}
              </h2>
              <button
                onClick={() => {
                  setShowQuestionForm(false);
                  setEditingQuestionIndex(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soru <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newQuestion.text}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, text: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="Soru metnini buraya yazın..."
                  required
                />
              </div>

              <div className="space-y-4">
                {newQuestion.options.map((option, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {String.fromCharCode(65 + index)}) Şık{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newQuestion.options];
                        newOptions[index] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: newOptions });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={`${index + 1}. şık`}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowQuestionForm(false);
                    setEditingQuestionIndex(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
                >
                  {editingQuestionIndex !== null ? "Güncelle" : "Soru Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseEdit;
