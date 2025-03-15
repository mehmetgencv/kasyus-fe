import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Üst Bölüm: Bağlantılar */}
                <div className={styles.footerGrid}>
                    {/* Satıcı Paneli */}
                    <div className={styles.footerSection}>
                        <h3>Satıcı Paneli</h3>
                        <ul>
                            <li>
                                <Link href="/seller/dashboard" className="hover:text-orange-500">
                                    Ana Sayfa
                                </Link>
                            </li>
                            <li>
                                <Link href="/seller/add-product" className="hover:text-orange-500">
                                    Ürün Ekle
                                </Link>
                            </li>
                            <li>
                                <Link href="/seller/edit" className="hover:text-orange-500">
                                    Ürün Düzenle
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Yardım */}
                    <div className={styles.footerSection}>
                        <h3>Yardım</h3>
                        <ul>
                            <li>
                                <Link href="/help/faq" className="hover:text-orange-500">
                                    Sıkça Sorulan Sorular
                                </Link>
                            </li>
                            <li>
                                <Link href="/help/support" className="hover:text-orange-500">
                                    Destek Talebi
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Güvenlik */}
                    <div className={styles.footerSection}>
                        <h3>Güvenlik</h3>
                        <div>
                            <span>Güvenlik Sertifikası</span>
                            <div className="flex space-x-2 mt-2">
                                {/*<img src="/tr-icon.png" alt="TR" className="w-6 h-6" />*/}
                                {/*<img src="/ssl-icon.png" alt="SSL" className="w-6 h-6" />*/}
                                {/*<img src="/pcv-icon.png" alt="PCV" className="w-6 h-6" />*/}
                            </div>
                        </div>
                    </div>

                    {/* Sosyal Medya ve Mobil Uygulamalar */}
                    {/*<div className={styles.footerSection}>*/}
                    {/*    <h3>Bağlantılar</h3>*/}
                    {/*    <div>*/}
                    {/*        <div className="flex space-x-4 mb-2">*/}
                    {/*            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">*/}
                    {/*                <img src="/facebook-icon.png" alt="Facebook" className="w-6 h-6" />*/}
                    {/*            </a>*/}
                    {/*            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">*/}
                    {/*                <img src="/instagram-icon.png" alt="Instagram" className="w-6 h-6" />*/}
                    {/*            </a>*/}
                    {/*            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">*/}
                    {/*                <img src="/youtube-icon.png" alt="YouTube" className="w-6 h-6" />*/}
                    {/*            </a>*/}
                    {/*        </div>*/}
                    {/*        <div className="flex space-x-2">*/}
                    {/*            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer">*/}
                    {/*                <img src="/appstore-icon.png" alt="App Store" className="w-20 h-6" />*/}
                    {/*            </a>*/}
                    {/*            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">*/}
                    {/*                <img src="/googleplay-icon.png" alt="Google Play" className="w-20 h-6" />*/}
                    {/*            </a>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>

                {/* Alt Bölüm: Telif Hakkı ve Ek Bilgi */}
                <div className={styles.footerBottom}>
                    <p>
                        © {new Date().getFullYear()} Kasyus. Tüm hakları saklıdır. |{' '}
                        <Link href="/terms" className="hover:text-orange-500">
                            Kullanım Koşulları
                        </Link>{' '}
                        |{' '}
                        <Link href="/privacy" className="hover:text-orange-500">
                            Gizlilik Politikası
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}