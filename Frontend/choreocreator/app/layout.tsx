'use client';
import '@ant-design/v5-patch-for-react-19';
import { usePathname } from 'next/navigation';
import { Layout } from "antd";
import "./globals.css";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { AuthProvider } from "./context/auth-context";
import AppHeader from './components/Header/Header';

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
      <body style={{ background: '#041527' }}>
        <AuthProvider>
          <Layout style={{ minHeight: "100vh", justifyContent:"space-betweem", background: 'transparent' }}>
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
                  borderTop: '1px solid #404040',
                  textAlign: "center",
                  background: 'transparent',
                  color: '#FFFFFF'
                }}
              >
                © 2025 Choreo Creator. Created by Stepan Smorodnikov
              </Footer>}
          </Layout>
        </AuthProvider>
      </body>
    </html >
  );
}