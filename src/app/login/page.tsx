'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Login işlemi direkt AuthContext üzerinden
        await login(formData.email, formData.password);
        router.push('/profile');
      } else {
        // Kayıt işlemi
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            role: 'USER', // Role parametresi eklendi
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Kayıt başarısız');
        }

        setIsLogin(true);
        setError('Kayıt başarılı, lütfen giriş yapın');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
    }
  };

  return (
      <div className="min-h-screen bg-orange-50 py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="text-center py-6 bg-orange-500">
            <Link href="/">
              <Image
                  src="/images/kasyus.svg"
                  alt="Kasyus Logo"
                  width={150}
                  height={50}
                  className="mx-auto"
              />
            </Link>
          </div>

          <div className="p-8">
            <div className="flex mb-8 bg-orange-100 rounded-lg p-1">
              <button
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors
                ${isLogin ? 'bg-orange-500 text-white' : 'text-orange-600'}`}
                  onClick={() => setIsLogin(true)}
              >
                Giriş Yap
              </button>
              <button
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors
                ${!isLogin ? 'bg-orange-500 text-white' : 'text-orange-600'}`}
                  onClick={() => setIsLogin(false)}
              >
                Kayıt Ol
              </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Ad Soyad
                    </label>
                    <input
                        type="text"
                        name="name"
                        className="auth-input"
                        placeholder="Adınız ve soyadınız"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                  </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  E-posta
                </label>
                <input
                    type="email"
                    name="email"
                    className="auth-input"
                    placeholder="ornek@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Şifre
                </label>
                <input
                    type="password"
                    name="password"
                    className="auth-input"
                    placeholder="********"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
              </div>

              {isLogin && (
                  <div className="flex items-center justify-between mb-6">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-600">Beni hatırla</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600">
                      Şifremi unuttum
                    </Link>
                  </div>
              )}

              <button type="submit" className="btn-primary w-full mb-4">
                {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
              </button>
            </form>
          </div>
        </div>
      </div>
  );
}