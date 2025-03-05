import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { loginWithEmail } from '../../http/requests';
import toast from 'react-hot-toast';
import { saveUserTokens } from '../../utils/storage';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const logindata=await loginWithEmail(email, password);
      saveUserTokens(logindata.tokens);
    if(logindata.user.role==='COMPANY_ADMIN'){
      navigate('/admin');
    }
    } catch (error) {
      setError('Giriş bilgileri hatalı');
      toast.error('Giriş bilgileri hatalı');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <GraduationCap className="w-12 h-12 mx-auto text-primary" />
          <h1 className="text-2xl font-bold mt-4 text-primary-darker">AcademyX Admin</h1>
          <p className="text-sm opacity-75">Yönetici paneline hoş geldiniz</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded hover:bg-primary-dark transition-colors flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;