'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export interface CategoryDto {
    id: number;
    name: string;
}

interface CategoryResponse {
    data: CategoryDto[];
    success: boolean;
    message?: string;
    responseDate?: string;
}

function UserIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="user-icon"
            style={{ verticalAlign: 'middle', width: '22px', height: '22px' }}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="search-icon"
            style={{ width: '20px', height: '20px', verticalAlign: 'middle' }}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197a7.5 7.5 0 1 0-1.061 1.061L20 20m-7.5-7.5a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" />
        </svg>
    );
}

export default function Navbar() {
    const { user, token, logout, isLoading } = useAuth();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8072';

    useEffect(() => {
        setDropdownOpen(false);
        fetchCategories();
    }, [token]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${apiUrl}/product-service/api/v1/categories`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Kategoriler yüklenemedi: ${response.status} - ${await response.text()}`);
            }

            const data: CategoryResponse = await response.json();
            console.log('Kategoriler:', data); // Hata ayıklama
            if (data.success && data.data) {
                setCategories(data.data);
            } else {
                throw new Error(data.message || 'Kategoriler yüklenemedi');
            }
        } catch (error) {
            console.error('Kategorileri getirirken hata:', error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Arama sorgusu:', searchQuery);
        // Arama işlemini burada yapabilirsiniz (örneğin, router.push ile yönlendirme)
    };

    if (isLoading) return <div className={styles.navbarPlaceholder} />;
    console.log('User Role:', user?.role);
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <Image src="/images/kasyus.svg" alt="Kasyus Logo" width={120} height={40} priority />
                </Link>

                {/* Arama Çubuğu */}
                <form onSubmit={handleSearch} className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Aradığınız ürünü, kategoriyi veya markayı yazın..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    <button type="submit" className={styles.searchButton}>
                        <SearchIcon />
                    </button>
                </form>

                {/* Kategori Menüsü */}
                <div className={styles.categoryMenu}>
                    <button className={styles.categoryButton}>Tüm Kategoriler</button>
                    <div className={styles.categoryDropdown}>
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/categories/${category.id}`}
                                className={styles.categoryItem}
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Sağ Menü */}
                <div className={styles.rightMenu}>
                    {token ? (
                        <div
                            className={styles.accountMenu}
                            onMouseEnter={() => setDropdownOpen(true)}
                            onMouseLeave={() => setDropdownOpen(false)}
                            style={{ position: 'relative' }}
                        >
                            <button className={styles.accountButton}>
                                <UserIcon />
                            </button>

                            {isDropdownOpen && (
                                <div
                                    className={styles.dropdownMenu}
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: '0',
                                        backgroundColor: 'white',
                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                        borderRadius: '4px',
                                        padding: '8px 0',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        textAlign: 'left',
                                        minWidth: '200px',
                                    }}
                                >
                                    <Link
                                        href="/orders"
                                        className={styles.dropdownItem}
                                        style={{ padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', whiteSpace: 'nowrap' }}
                                    >
                                        Tüm Siparişlerim
                                    </Link>
                                    {user?.role === 'ROLE_ADMIN' && (
                                        <Link
                                            href="/admin"
                                            className={styles.dropdownItem}
                                            style={{ padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', whiteSpace: 'nowrap' }}>
                                            Admin Portal
                                        </Link>
                                    )}

                                    {(user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_SELLER') && (
                                        <Link
                                            href="/seller"
                                            className={styles.dropdownItem}
                                            style={{ padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', whiteSpace: 'nowrap' }}>

                                            Seller Portal
                                        </Link>
                                    )}
                                    <Link
                                        href="/profile"
                                        className={styles.dropdownItem}
                                        style={{ padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', whiteSpace: 'nowrap' }}
                                    >
                                        Kullanıcı Bilgilerim
                                    </Link>
                                    <Link
                                        href="/profile/addresses"
                                        className={styles.dropdownItem}
                                        style={{ padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', whiteSpace: 'nowrap' }}
                                    >
                                        Adreslerim
                                    </Link>
                                    <Link
                                        href="/profile/payment-methods"
                                        className={styles.dropdownItem}
                                        style={{ padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', whiteSpace: 'nowrap' }}
                                    >
                                        Ödeme Yöntemlerim
                                    </Link>
                                    <Link
                                        href="/profile/wishlist-items"
                                        className={styles.dropdownItem}
                                        style={{ padding: '12px 16px', textDecoration: 'none', color: '#333', fontSize: '14px', whiteSpace: 'nowrap' }}
                                    >
                                        Favorilerim
                                    </Link>
                                    <button
                                        className={styles.dropdownItem}
                                        onClick={logout}
                                        style={{ padding: '12px 16px', background: 'none', border: 'none', color: '#333', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                    >
                                        Çıkış Yap
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login" className={styles.loginButton}>
                            Giriş Yap
                        </Link>
                    )}

                    <Link href="/wishlist" className={styles.iconLink}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            style={{ width: '22px', height: '22px', verticalAlign: 'middle' }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                    </Link>

                    <Link href="/cart" className={styles.iconLink}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            style={{ width: '22px', height: '22px', verticalAlign: 'middle' }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25l-1.41.391M3 3l4.164 8.25M12.75 10.5v.75m-2.25.75v.75m9-4.5v.75M3 3l5.25 11.25M9 6l5.25 11.25M9 6l6.75 0" />
                        </svg>
                    </Link>
                </div>
            </div>
        </nav>
    );
}