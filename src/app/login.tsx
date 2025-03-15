// src/app/login.tsx
import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Giriş işlemi yapılacak
        console.log('Giriş yapılacak:', { email, password });
    };

    return (
        <div className="min-h-screen bg-orange-100 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl text-center font-semibold text-orange-600">Giriş Yap</h2>
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-posta</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Şifre</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-lg">Giriş Yap</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
