import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  X,
  Copy,
  Check,
} from "lucide-react";
import {
  addCompanyUser,
  deleteCompanyUser,
  getCompanyDetails,
  getCompanyUsers,
  updateCompanyUser,
} from "../../http/requests/admin";

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

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyRole: "manager" | "employee";
  companyId: string;
  createdAt: string;
}

interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  companyRole: ""| "manager" | "employee";
}

const CompanyDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userFormData, setUserFormData] = useState<UserFormData>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    companyRole: "employee",
  });

  const generatePassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";

    // En az bir büyük harf
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    // En az bir küçük harf
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    // En az bir rakam
    password += "0123456789"[Math.floor(Math.random() * 10)];
    // En az bir özel karakter
    password += "!@#$%^&*"[Math.floor(Math.random() * 8)];

    // Geri kalan karakterler
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Karakterleri karıştır
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    setUserFormData((prev) => ({ ...prev, password }));
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(userFormData.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Şifre kopyalanırken hata oluştu:", err);
    }
  };

  useEffect(() => {
    if (!selectedUser && isUserModalOpen) {
      generatePassword();
    }
  }, [selectedUser, isUserModalOpen]);

  useEffect(() => {
    if (id) {
      fetchCompany();
      fetchUsers();
    }
  }, [id]);

  const fetchCompany = async () => {
    if (!id) return;
    setLoading(true);

    try {
      const comp= await  getCompanyDetails(id)
      setCompany(comp)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching company:", error);
      setError("Şirket bilgileri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!id) return;
    try {
      const usersData = await getCompanyUsers(id);
      console.log('usersData',usersData);
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Kullanıcılar yüklenirken bir hata oluştu.");
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    // Şifre kontrolü
    if (!selectedUser) {
      // Sadece yeni kullanıcı eklerken kontrol et
      if (userFormData.password.length < 8) {
        setError("Şifre en az 8 karakter uzunluğunda olmalıdır.");
        return;
      }
      if (!/[A-Z]/.test(userFormData.password)) {
        setError("Şifre en az bir büyük harf içermelidir.");
        return;
      }
      if (!/[a-z]/.test(userFormData.password)) {
        setError("Şifre en az bir küçük harf içermelidir.");
        return;
      }
      if (!/[0-9]/.test(userFormData.password)) {
        setError("Şifre en az bir rakam içermelidir.");
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      if (selectedUser) {
        await updateCompanyUser(selectedUser.id, userFormData);
      } else {
        console.log('company',company.id);
        console.log('userFormData',userFormData);
        await addCompanyUser(company.id, userFormData);
      }

      setIsUserModalOpen(false);
      setSelectedUser(null);
      setUserFormData({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        companyRole: "",
      });
      await fetchUsers();
    } catch (error: any) {
      console.error("Error saving user:", error);

      if (error.code === "auth/email-already-in-use") {
        setError(
          "Bu e-posta adresi zaten kullanımda. Lütfen farklı bir e-posta adresi kullanın."
        );
      } else if (error.code === "auth/invalid-email") {
        setError("Geçersiz e-posta adresi.");
      } else if (error.code === "auth/weak-password") {
        setError("Şifre çok zayıf. Lütfen daha güçlü bir şifre belirleyin.");
      } else {
        setError(error.message || "Kullanıcı kaydedilirken bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setUserFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: "",
      companyRole: user.companyRole,
    });
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteCompanyUser(user.id);
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Kullanıcı silinirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (!company) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <button
        onClick={() => navigate("/admin/companies")}
        className="flex items-center text-gray-600 hover:text-primary mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Şirketlere Dön
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            <Building2 className="w-12 h-12 text-primary mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-primary-darker">
                {company.name}
                {!company.isActive && (
                  <span className="ml-2 text-sm text-red-500">(Pasif)</span>
                )}
              </h1>
              <p className="text-gray-600">{company.sector}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Şirket Bilgileri</h3>
            <div className="space-y-3">
              <p>
                <span className="font-medium">Büyüklük:</span> {company.size}
              </p>
              <p>
                <span className="font-medium">Durum:</span>{" "}
                <span
                  className={
                    company.isActive ? "text-green-600" : "text-red-600"
                  }
                >
                  {company.isActive ? "Aktif" : "Pasif"}
                </span>
              </p>
              <p>
                <span className="font-medium">Kayıt Tarihi:</span>{" "}
                {new Date(company.createdAt).toLocaleDateString("tr-TR")}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">İletişim Bilgileri</h3>
            <div className="space-y-3">
              <p>
                <span className="font-medium">E-posta:</span> {company.email}
              </p>
              <p>
                <span className="font-medium">Telefon:</span> {company.phone}
              </p>
              <p>
                <span className="font-medium">Adres:</span> {company.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Kullanıcılar</h2>
          </div>
          <button
            onClick={() => {
              setSelectedUser(null);
              setUserFormData({
                email: "",
                firstName: "",
                lastName: "",
                password: "",
                companyRole: "",
              });
              setIsUserModalOpen(true);
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Kullanıcı
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

        <div className="grid gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-gray-50 p-4 rounded-lg flex items-center justify-between"
            >
              <div>
                <h4 className="font-medium">
                  {user.firstName} {user.lastName}
                </h4>
                <p className="text-sm text-gray-600">{user.email}</p>
                <span className="inline-block px-2 py-1 text-xs rounded-full mt-1 bg-primary bg-opacity-10 text-primary">
                  {user.companyRole === "manager" ? "Yönetici" : "Çalışan"}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditUser(user)}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteUser(user)}
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <p className="text-gray-600 text-sm">Henüz kullanıcı eklenmemiş.</p>
          )}
        </div>
      </div>

      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary-darker">
                {selectedUser ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Ekle"}
              </h2>
              <button
                onClick={() => {
                  setIsUserModalOpen(false);
                  setSelectedUser(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUserSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={userFormData.firstName}
                  onChange={(e) =>
                    setUserFormData({
                      ...userFormData,
                      firstName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soyad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={userFormData.lastName}
                  onChange={(e) =>
                    setUserFormData({
                      ...userFormData,
                      lastName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              {!selectedUser && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={userFormData.email}
                      onChange={(e) =>
                        setUserFormData({
                          ...userFormData,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="space-y-2 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Şifre <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex space-x-2">
                        <div className="relative flex-1">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={userFormData.password}
                            onChange={(e) =>
                              setUserFormData({
                                ...userFormData,
                                password: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-20"
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
                          >
                            {showPassword ? "Gizle" : "Göster"}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={generatePassword}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm whitespace-nowrap"
                        >
                          Yeni Şifre
                        </button>
                        <button
                          type="button"
                          onClick={copyPassword}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
                          title="Şifreyi Kopyala"
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Otomatik oluşturulan güvenli şifre. Kullanıcıya iletmeyi
                        unutmayın!
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  value={userFormData.companyRole}
                  onChange={(e) =>
                    setUserFormData({
                      ...userFormData,
                      companyRole: e.target.value as UserFormData["companyRole"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="employee">Çalışan</option>
                  <option value="manager">Yönetici</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserModalOpen(false);
                    setSelectedUser(null);
                  }}
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
                  ) : selectedUser ? (
                    "Güncelle"
                  ) : (
                    "Kullanıcı Ekle"
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

export default CompanyDetails;
