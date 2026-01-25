'use client';
import '@ant-design/v5-patch-for-react-19';
import { usePathname } from 'next/navigation';
import { Layout } from "antd";
import "./globals.css";
import { Content, Footer } from "antd/es/layout/layout";
import { AuthProvider } from "./context/auth-context";
import AppHeader from './components/Header/Header';
import { ThemeProvider } from "./context/theme-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideFooter = pathname === '/editor';
  const noPadding = pathname === '/editor';

  return (
    <html lang="en">
      <body className="app-body">
        <ThemeProvider>
          <AuthProvider>
            <Layout style={{ minHeight: "100vh", justifyContent: "space-betweem", background: 'transparent' }}>
              <AppHeader />
              {!noPadding
                ? <Content
                  style={{
                    padding: "0 48px",
                    background: 'transparent'
                  }}
                >
                  {children}
                </Content>
                : <Content
                  style={{
                    padding: "0 0px",
                    background: 'transparent'
                  }}
                >
                  {children}
                </Content>}
              {!hideFooter &&
                <Footer
                  style={{
                    borderTop: '1px solid var(--app-border)',
                    textAlign: "center",
                    background: 'transparent',
                    color: 'var(--app-text)'
                  }}
                >
                  © 2025 Choreo Creator. Created by Stepan Smorodnikov
                </Footer>}
            </Layout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
