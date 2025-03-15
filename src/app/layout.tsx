import './globals.css';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'kasyus',
    description: 'Welcome to kasyus',

};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr">
        <body className="flex flex-col min-h-screen">
        <AuthProvider>
            <Navbar />
            <main className="container flex-1">{children}</main>
            <Footer />
        </AuthProvider>
        </body>
        </html>
    );
}