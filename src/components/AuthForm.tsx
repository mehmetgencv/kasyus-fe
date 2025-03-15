'use client';
import { useState } from 'react';

interface AuthFormProps {
    isLogin: boolean;
    onSubmit: (email: string, password: string, name?: string) => void;
}

export default function AuthForm({ isLogin, onSubmit }: AuthFormProps) {
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData.email, formData.password, formData.name);
    };

    return (
        <form onSubmit={handleSubmit}>
            {!isLogin && (
                <input type="text" name="name" placeholder="Ad Soyad" value={formData.name} onChange={handleChange} required />
            )}
            <input type="email" name="email" placeholder="E-posta" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Şifre" value={formData.password} onChange={handleChange} required />
            <button type="submit">{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</button>
        </form>
    );
}
