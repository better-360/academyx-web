import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, X, Building2 } from 'lucide-react';
import { createCustomSurvey, getAllCompanines, getAllSurveys } from '../../http/requests/admin';

interface Company {
  id: string;
  name: string;
}

interface Course {
  id: string;
  title: string;
  description?: string;
}

interface Assignment {
  id: string;
  courseId: string;
  companyId: string;
  assignedAt: string;
  dueDate?: string;
  courseName: string;
  companyName: string;
}

const AssignAssessments = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [surveys, setSurveys] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [formData, setFormData] = useState({
    title:'',
    surveyId: '',
    companyId: '',
    dueDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const companiesData=await getAllCompanines();
      setCompanies(companiesData);
      const surveysData = await getAllSurveys();
      setSurveys(surveysData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if already assigned
      const existingAssignment = assignments.find(
        a => a.courseId === formData.surveyId && a.companyId === formData.companyId
      );

      if (existingAssignment) {
        throw new Error('Bu değerlendirme zaten bu şirkete atanmış.');
      }

      // Create assignment
      const customSurveyData = {
        title: formData.title,
        surveyId: formData.surveyId,
        companyId: formData.companyId,
        dueDate: formData.dueDate || null
      };

      await createCustomSurvey(customSurveyData);

      setShowAssignModal(false);
      setFormData({
        title:'',
        surveyId: '',
        companyId: '',
        dueDate: ''
      });
      await fetchData();
    } catch (error: any) {
      console.error('Error assigning assessment:', error);
      setError(error.message || 'Değerlendirme atanırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assignmentId: string) => {
    if (!window.confirm('Bu atamayı silmek istediğinizden emin misiniz?')) {
      return;
    }

    setLoading(true);
    try {
      await fetchData();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      setError('Atama silinirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-darker flex items-center">
            <ClipboardList className="w-8 h-8 mr-2" />
            Değerlendirme Atamaları
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Toplam {assignments.length} atama
          </p>
        </div>
        <button
          onClick={() => setShowAssignModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-dark transition-colors"
          disabled={loading}
        >
          <Plus className="w-5 h-5 mr-2" />
          Yeni Atama
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Değerlendirme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Şirket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Atanma Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Tarih
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {assignment.courseName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">{assignment.companyName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(assignment.assignedAt).toLocaleDateString('tr-TR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('tr-TR') : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {assignments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Henüz değerlendirme ataması yapılmamış
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary-darker">
                Yeni Değerlendirme Ataması
              </h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAssign} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Değerlendirme <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.surveyId}
                  onChange={(e) => setFormData({ ...formData, surveyId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Seçiniz</option>
                  {surveys.map((survey) => (
                    <option key={survey.id} value={survey.id}>
                      {survey.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şirket <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Seçiniz</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Son Tarih
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
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
                      Atanıyor...
                    </>
                  ) : (
                    'Ata'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignAssessments;