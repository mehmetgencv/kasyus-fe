'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export default function Profile() {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';
        const response = await fetch(`${apiUrl}/user-service/api/v1/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Profil verileri yüklenemedi. Hata kodu: ${response.status}`);
        }

        const responseData = await response.json();
        setProfile(responseData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
        logout();
        router.push('/login');
      }
    };

    fetchProfile();
  }, [token, router, logout]);

  const handleUpdate = async () => {
    if (!profile) return;
    setIsUpdating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';
      const response = await fetch(`${apiUrl}/user-service/api/v1/users/me/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Profil güncellenemedi.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Güncelleme sırasında hata oluştu');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 flex justify-center">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-orange-600 text-center mb-6">Üyelik Bilgilerim</h1>
          {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
          {profile && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-700 text-sm">Ad</label>
                    <input
                        type="text"
                        value={profile.firstName ?? ""}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm">Soyad</label>
                    <input
                        type="text"
                        value={profile.lastName ?? ""}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-700 text-sm">E-Mail</label>
                  <input
                      type="email"
                      value={profile.email ?? ""}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm">Cep Telefonu</label>
                  <input
                      type="text"
                      value={profile.phoneNumber ?? ""}
                      onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                      className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm">Doğum Tarihi</label>
                  <input
                      type="date"
                      value={profile.dateOfBirth ?? ""}
                      onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                      className="w-full p-2 border rounded-md"
                  />
                </div>
                <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className={`w-full py-2 rounded-lg text-white ${isUpdating ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'}`}
                >
                  {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
                </button>
              </div>
          )}
        </div>
      </div>
  );
}
