import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, AlertCircle } from "lucide-react";
import { loginWithEmail } from "../../http/requests";
import { saveUserTokens, setActiveCompanyId } from "../../utils/storage";
import { useAppDispatch } from "../../store/hooks";
import { login } from "../../store/slices/userSlice";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const loginData = await loginWithEmail(email, password);
      // Only store serializable data
      const { tokens, user } = loginData;
      saveUserTokens(tokens);
      dispatch(login({ user, tokens }));
      setActiveCompanyId(user.companyId);

      if (user.role === "COMPANY_ADMIN") {
        throw new Error("Bu hesap çalışan hesabı değil.");
      }
      navigate("/user");
     } catch (error: any) {
  // Konsola yazdırırken sembollerden kurtulmak için bu satırı kullan.
  console.error("Login error:", JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))));

  if (error.message === "Bu hesap çalışan hesabı değil.") {
    setError(error.message);
  } else if (error.code === "auth/invalid-email") {
    setError("Geçersiz e-posta adresi.");
  } else if (error.code === "auth/wrong-password") {
    setError("Hatalı şifre.");
  } else {
    setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
  }
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-darker via-primary to-primary-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo ve Başlık */}
        <div className="text-center mb-8">
          <div className="bg-white p-4 rounded-full inline-block mb-6 shadow-lg">
            <GraduationCap className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AcademyX</h1>
          <p className="text-white text-opacity-90">
            Kurumsal Değerlendirme Platformu
          </p>
        </div>

        {/* Giriş Formu */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-2xl font-semibold text-primary-darker mb-6">
            Hoş Geldiniz
          </h2>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="ornek@sirket.com"
                  required
                  disabled={loading}
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Giriş Yapılıyor...</span>
                </div>
              ) : (
                <span>Giriş Yap</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Şirketinize özel değerlendirme platformu
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-white text-opacity-80">
            © {new Date().getFullYear()} AcademyX. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;