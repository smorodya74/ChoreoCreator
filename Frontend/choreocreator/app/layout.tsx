'use client';
import '@ant-design/v5-patch-for-react-19';
import { Layout, Menu} from "antd";
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
    />
  </Link>
);

const items = [
  { key: "features", label: <Link href={"/features"}>Features</Link> }, // Заглушка (О сервисе)
  { key: "scenarios", label: <Link href={"/scenarios"}>Base</Link> }, // Реализовать функции
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: 'transparent'}}>
              <LogoLink />
              <Menu
                theme="dark"
                mode="horizontal"
                items={items}
                style={{ flex: 1, minWidth: 0 }}
              />
              <HeaderRight />
            </Header>
            <Content style={{ padding: "0 48px" }}>{children}</Content>
            <Footer style={{ textAlign: "center" }}>
              © 2025 Choreo Creator. Created by Stepan Smorodnikov
            </Footer>
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
}