'use client';
import '@ant-design/v5-patch-for-react-19';
import { usePathname } from 'next/navigation';
import { Layout, Menu } from "antd";
import "./globals.css";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { AuthProvider } from "./context/auth-context";
import Link from "next/link";
import HeaderRight from './components/Header';
import logo from "@/public/logo.svg"
import Image from "next/image";

const LogoLink = () => (
  <Link href="/" style={{ display: "flex", alignItems: "center" }}>
    <Image
      src={logo}
      alt="ChoreoCreator Logo"
      width={50}
      height={50}
      priority
      style={{ display: "block" }}
    />
  </Link>
);

const items = [
  { key: "home", label: <Link href={"/"}>Главная</Link> },
  { key: "scenarios", label: <Link href={"/scenarios"}>Шаблоны</Link> },
  { key: "editor", label: <Link href={"/editor"}>Редактор</Link> },
];

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
          <Layout style={{ minHeight: "100vh", background: 'transparent' }}>
            <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <LogoLink />
              <Menu
                theme="dark"
                mode="horizontal"
                items={items}
                style={{ flex: 1, minWidth: 0 }}
              />
              <HeaderRight />
            </Header>
            {!noPadding
              ? <Content style={{ padding: "0 48px", background: 'transparent' }}>{children}</Content>
              : <Content style={{ padding: "0 0px", background: 'transparent' }}>{children}</Content>}
            {!hideFooter &&
              <Footer style={{ borderTop: '1px solid #404040', textAlign: "center", background: 'transparent', color: '#FFFFFF' }}>
                © 2025 Choreo Creator. Created by Stepan Smorodnikov
              </Footer>}
          </Layout>
        </AuthProvider>
      </body>
    </html >
  );
}