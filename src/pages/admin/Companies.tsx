import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Building2, Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createCompany, deleteCompany, getAllCompanines, updateCompany, updateCompanyStatus } from '../../http/requests/admin';

interface Company {
  id: string;
  name: string;
  sector?: string;
  size?: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: string;
}

const Companies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    size: '',
    email: '',
    phone: '',
    address: '',
    isActive: true
  });

  const companySizes = [
    '1-10 çalışan',
    '11-50 çalışan',
    '51-200 çalışan',
    '201-500 çalışan',
    '500+ çalışan'
  ];

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const companiesData = await getAllCompanines();
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError('Şirketler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const companyData = {
        ...formData,
      };

      if (selectedCompany) {
        await updateCompany(selectedCompany.id, companyData);
      } else {
        await createCompany(companyData);
      }
      
      setIsModalOpen(false);
      setSelectedCompany(null);
      setFormData({
        name: '',
        sector: '',
        size: '',
        email: '',
        phone: '',
        address: '',
        isActive: true
      });
      await fetchCompanies();
    } catch (error) {
      console.error('Error saving company:', error);
      setError('Şirket kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (company: Company) => {
    setLoading(true);
    setError(null);
    try {
      updateCompanyStatus(company.id,!company.isActive);
      await fetchCompanies();
    } catch (error) {
      console.error('Error updating company status:', error);
      setError('Şirket durumu güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      sector: company.sector || '',
      size: company.size || '',
      email: company.email,
      phone: company.phone,
      address: company.address,
      isActive: company.isActive
    });
    setIsModalOpen(true);
  };

  const handleView = (company: Company) => {
    navigate(`/admin/companies/${company.id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu şirketi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      setLoading(true);
      setError(null);
      try {
        await deleteCompany(id);
        await fetchCompanies();
      } catch (error) {
        console.error('Error deleting company:', error);
        setError('Şirket silinirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-darker">Şirket Yönetimi</h1>
          <p className="text-sm text-gray-600 mt-1">
            Toplam {companies.length} şirket
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedCompany(null);
            setFormData({
              name: '',
              sector: '',
              size: '',
              email: '',
              phone: '',
              address: '',
              isActive: true
            });
            setIsModalOpen(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-dark transition-colors"
          disabled={loading}
        >
          <Plus className="w-5 h-5 mr-2" />
          Yeni Şirket
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
          {companies.map((company) => (
            <div key={company.id} className={`bg-white rounded-lg shadow-md p-6 ${!company.isActive ? 'opacity-75' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <Building2 className="w-8 h-8 text-primary mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-primary-darker">
                      {company.name}
                      {!company.isActive && (
                        <span className="ml-2 text-sm text-red-500">(Pasif)</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">{company.sector}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleView(company)}
                    className="text-gray-600 hover:text-primary transition-colors"
                    disabled={loading}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(company)}
                    className="text-gray-600 hover:text-primary transition-colors"
                    disabled={loading}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(company.id)}
                    className="text-gray-600 hover:text-red-500 transition-colors"
                    disabled={loading}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Büyüklük:</span> {company.size}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">E-posta:</span> {company.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Telefon:</span> {company.phone}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary-darker">
                {selectedCompany ? 'Şirket Düzenle' : 'Yeni Şirket Ekle'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şirket Adı <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sektör
                  </label>
                  <input
                    type="text"
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şirket Büyüklüğü
                  </label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Seçiniz</option>
                    {companySizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                {selectedCompany && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Aktif
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adres <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                  ) : (
                    selectedCompany ? 'Güncelle' : 'Ekle'
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

export default Companies;