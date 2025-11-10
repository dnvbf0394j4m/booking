import React, { useState } from 'react';
import { Outlet } from "react-router";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Layout, Menu, Space, theme } from 'antd';
import logo from '../../Images/logo.svg';
import logo_mini from '../../Images/logo-mini.svg';
import '../Layout/lauout.css';

const { Header, Sider, Content } = Layout;
const app = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  const items = [
  {
    label: (
      <a href="https://www.antgroup.com" target="_blank" rel="noopener noreferrer">
        1st menu item
      </a>
    ),
    key: '0',
  },
  {
    label: (
      <a href="https://www.aliyun.com" target="_blank" rel="noopener noreferrer">
        2nd menu item
      </a>
    ),
    key: '1',
  },
  {
    type: 'divider',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
];
  return (
    // <Layout style={{background:"red",minHeight: "100vh", width: "100%",minWidth:"100vw"}}>
    //   <Header>

    //   </Header>
    //   <Outlet/>
    // </Layout>

    <Layout style={{ minHeight: "100vh", width: "100%", minWidth: "100vw",margin:'0' }}>


      <Header style={{ padding: 0, background: colorBgContainer }}>

        <div className='header'>
          <div className={collapsed ? 'header_logo_mini' : 'header_logo'}>
            <img src={collapsed ? logo_mini : logo} alt="Logo" style={{ height: 40, width: '100px' }} />
          </div>


          <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1, paddingLeft: 20, paddingRight: 40 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <div className='head_right'>
              <div>
                <Dropdown menu={{ items }} trigger={['click']}>
                  <a onClick={e => e.preventDefault()}>
                    <div>
                      
                      <BellOutlined style={{fontSize:20}} />
                    </div>
                  </a>
                </Dropdown>
              </div>

              <div>
                prifile
              </div>
            </div>

          </div>


        </div>


      </Header>
      <Layout>
        <Sider trigger={'long dz vl'} collapsible collapsed={collapsed} width={240}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <UserOutlined />,
                label: 'nav 1',
              },
              {
                key: '2',
                icon: <VideoCameraOutlined />,
                label: 'nav 2',
              },
              {
                key: '3',
                icon: <UploadOutlined />,
                label: 'nav 3',
              },
            ]}
          />
        </Sider>
        <Content
          style={{
            
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default app;