'use client';
import { Layout } from 'antd';
import { useState } from 'react';
import EditorSidebar from '@/app/components/EditorSidebar';
import { useAuth } from '../context/auth-context';

const { Header, Content } = Layout;

export default function EditorPage() {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuth();

    return (
        <Layout style={{ height: 'calc(100vh - 64px)'}}>
            <EditorSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <Layout>
                <Content style={{ margin: '15px 15px 0px 15px', padding: 24, background: '#FFFFFF' }}>
                    {}
                    <p>Редактор активен</p>
                </Content>
            </Layout>
        </Layout>
    );
}
