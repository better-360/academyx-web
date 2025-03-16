import { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, Filter, Trash2, Mail, Calendar, Plus, X, Check, Copy, Pencil } from 'lucide-react';
import { addPersonnel, deletePersonnel, getMyPersonnels } from '../../http/requests/companyRequests';
import { generatePassword } from '../../utils/common';
import { addCompanyUser, updateCompanyUser } from '../../http/requests/admin';
interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  companyRole: "manager" | "employee";
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


const ManagerUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'role' | 'company'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [userFormData, setUserFormData] = useState<UserFormData>({
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      companyRole: "employee",
    });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res= await getMyPersonnels();
      setUsers(res);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Kullanıcılar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      if (!selectedUser && isUserModalOpen) {
        const randomPassword= generatePassword();
        setUserFormData((prev) => ({ ...prev, randomPassword }));
  
      }
    }, [selectedUser, isUserModalOpen]);

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(userFormData.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Şifre kopyalanırken hata oluştu:", err);
    }
  };


  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      return;
    }

    setLoading(true);
    try {
      await deletePersonnel(userId);
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Kullanıcı silinirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users
    .filter(user => {
      const searchMatch = 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company?.name.toLowerCase().includes(searchTerm.toLowerCase());

      const roleMatch = roleFilter === 'all' || user.companyRole === roleFilter;

      return searchMatch && roleMatch;
    })
    .sort((a, b) => {
      let compareA, compareB;

      switch (sortBy) {
        case 'name':
          compareA = `${a.firstName} ${a.lastName}`;
          compareB = `${b.firstName} ${b.lastName}`;
          break;
        case 'email':
          compareA = a.email;
          compareB = b.email;
          break;
        case 'role':
          compareA = a.role;
          compareB = b.role;
          break;
        case 'company':
          compareA = a.company?.name || '';
          compareB = b.company?.name || '';
          break;
        default:
          return 0;
      }

      return sortOrder === 'asc' 
        ? compareA.localeCompare(compareB)
        : compareB.localeCompare(compareA);
    });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'employee':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'manager':
        return 'Yönetici';
      case 'employee':
        return 'Çalışan';
      default:
        return role;
    }
  };

    const handleUserSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
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
          console.log('userFormData',userFormData);
          await addPersonnel(userFormData);
        }
  
  
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
        setIsUserModalOpen(false);
        setSelectedUser(null);
        setUserFormData({
          email: "",
          firstName: "",
          lastName: "",
          password: "",
          companyRole: "employee",
        });
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
  

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-darker flex items-center">
            <UsersIcon className="w-8 h-8 mr-2" />
            Kullanıcı Yönetimi
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Toplam {filteredUsers.length} kullanıcı
          </p>
        </div>
        <button
            onClick={() => {
              setUserFormData({
                email: "",
                firstName: "",
                lastName: "",
                password: "",
                companyRole: "employee",
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
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="İsim, e-posta veya şirket ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Tüm Roller</option>
                <option value="manager">Yönetici</option>
                <option value="employee">Çalışan</option>
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-primary"
                    onClick={() => {
                      if (sortBy === 'name') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('name');
                        setSortOrder('asc');
                      }
                    }}
                  >
                    İsim
                    {sortBy === 'name' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-primary"
                    onClick={() => {
                      if (sortBy === 'email') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('email');
                        setSortOrder('asc');
                      }
                    }}
                  >
                    E-posta
                    {sortBy === 'email' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-primary"
                    onClick={() => {
                      if (sortBy === 'role') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('role');
                        setSortOrder('asc');
                      }
                    }}
                  >
                    Rol
                    {sortBy === 'role' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kayıt Tarihi
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {getRoleText(user.companyRole)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                    </td>
                    <td className="px-6 py-4  space-x-2 whitespace-nowrap text-right text-sm font-medium">
                    <button
                  onClick={() => handleEditUser(user)}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Kullanıcı bulunamadı.</p>
              </div>
            )}
          </div>
        )}
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
                          onClick={()=>
                            setUserFormData((prev) => ({
                              ...prev,
                              password: generatePassword(),
                            }))
                          }
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
                  defaultValue={"employee"}
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

export default ManagerUsers;