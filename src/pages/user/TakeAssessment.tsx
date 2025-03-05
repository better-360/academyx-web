import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Lock, Shield, UserRound, BarChart } from 'lucide-react';



const TakeAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAssessment();
    }
  }, [id]);

  const fetchAssessment = async () => {

    setLoading(true);
    try {
      
    } catch (error: any) {
      console.error('Error fetching assessment:', error);
      setError(error.message || 'Değerlendirme yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < (assessment?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {

    setSubmitting(true);
    try {
      // Tüm soruların cevaplandığını kontrol et
      const unansweredCount = answers.filter(a => !a).length;
      if (unansweredCount > 0) {
        throw new Error(`${unansweredCount} soru cevaplanmamış. Lütfen tüm soruları cevaplayın.`);
      }
     
      navigate('/user');
    } catch (error: any) {
      console.error('Error submitting assessment:', error);
      setError(error.message || 'Değerlendirme gönderilirken bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartAssessment = () => {
    if (!agreedToTerms) {
      setError('Lütfen değerlendirme şartlarını kabul edin.');
      return;
    }
    setShowIntro(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => navigate('/user')}
              className="mt-2 text-sm text-red-700 hover:text-red-600"
            >
              Geri Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showIntro) {
    return (
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/user')}
          className="flex items-center text-gray-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Değerlendirmelere Dön
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary-darker mb-2">
              {assessment.title}
            </h1>
            <p className="text-gray-600">
              Değerlendirmeye başlamadan önce lütfen aşağıdaki bilgileri okuyun
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-blue-900">Gizlilik Garantisi</h3>
              </div>
              <p className="text-blue-800">
                Tüm cevaplarınız anonim olarak toplanır ve saklanır. Kimliğiniz hiçbir şekilde cevaplarınızla ilişkilendirilmez.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <UserRound className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-green-900">Dürüst Geri Bildirim</h3>
              </div>
              <p className="text-green-800">
                Samimi ve dürüst cevaplarınız, şirketinizin gelişimine önemli katkı sağlayacaktır.
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Lock className="w-8 h-8 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-purple-900">Güvenli Sistem</h3>
              </div>
              <p className="text-purple-800">
                Verileriniz güvenli bir şekilde saklanır ve sadece toplu istatistikler için kullanılır.
              </p>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <BarChart className="w-8 h-8 text-orange-600 mr-3" />
                <h3 className="text-lg font-semibold text-orange-900">Gelişim Odaklı</h3>
              </div>
              <p className="text-orange-800">
                Değerlendirme sonuçları, şirket kültürünü ve çalışma ortamını iyileştirmek için kullanılacaktır.
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="mb-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Yukarıdaki bilgileri okudum ve anladım. Değerlendirmeyi dürüstçe yanıtlayacağımı taahhüt ediyorum.
                </span>
              </label>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleStartAssessment}
                className={`px-6 py-3 rounded-lg flex items-center ${
                  agreedToTerms
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
                disabled={!agreedToTerms}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Değerlendirmeye Başla
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const progress = Math.round(((currentQuestionIndex + 1) / assessment.questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/user')}
        className="flex items-center text-gray-600 hover:text-primary mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Değerlendirmelere Dön
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-primary-darker mb-2">
          {assessment.courseName}
        </h1>
        {assessment.dueDate && (
          <p className="text-sm text-gray-600">
            Son Tarih: {new Date(assessment.dueDate).toLocaleDateString('tr-TR')}
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>İlerleme</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {currentQuestionIndex + 1}. {currentQuestion.text}
            </h3>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                    answers[currentQuestionIndex] === option
                      ? 'border-primary bg-primary bg-opacity-5'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={answers[currentQuestionIndex] === option}
                      onChange={(e) => handleAnswer(e.target.value)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <span className="ml-3">{option}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center px-4 py-2 rounded ${
                currentQuestionIndex === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Önceki Soru
            </button>
            {currentQuestionIndex === assessment.questions.length - 1 ? (
              <button
                onClick={() => setShowConfirmation(true)}
                disabled={!answers[currentQuestionIndex]}
                className={`flex items-center px-4 py-2 rounded ${
                  !answers[currentQuestionIndex]
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Değerlendirmeyi Tamamla
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!answers[currentQuestionIndex]}
                className={`flex items-center px-4 py-2 rounded ${
                  !answers[currentQuestionIndex]
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                Sonraki Soru
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Değerlendirmeyi tamamlamak istediğinizden emin misiniz?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Tamamladıktan sonra cevaplarınızı değiştiremezsiniz.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                disabled={submitting}
              >
                İptal
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark flex items-center"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gönderiliyor...
                  </>
                ) : (
                  'Tamamla'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeAssessment;
