import {
  BankOutlined,
  BellOutlined,
  HistoryOutlined,
  LineChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  ShopOutlined,
  StockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Dropdown,
  Layout,
  Menu,
  Space,
  Typography,
  Drawer,
  Grid,
} from "antd";
import type { MenuProps } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const profileMenu: MenuProps["items"] = [
  { key: "login", label: "Đăng nhập" },
  { type: "divider" },
  { key: "logout", danger: true, label: "Đăng xuất" },
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const screens = Grid.useBreakpoint();
  const isDesktop = !!screens.lg;

  const selectedKey = useMemo(() => {
    return location.pathname.slice(7);
  }, [location.pathname]);

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    navigate(`/admin/${key}`);
  };

  const onProfileClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "login") navigate("/login");
    if (key === "logout") console.log("logout clicked");
  };

  const menuItems: MenuProps["items"] = [
    { key: "dashboard", icon: <PieChartOutlined />, label: "Dashboard" },
    { key: "revenue", icon: <LineChartOutlined />, label: "Doanh thu" },
    { key: "users", icon: <UserOutlined />, label: "Khách hàng" },
    { key: "products", icon: <ShopOutlined />, label: "Sản phẩm" },
    {
      key: "inventory",
      icon: <BankOutlined />,
      label: "Kho hàng",
      children: [
        {
          key: "inventory-static",
          label: "Báo cáo kho hàng",
          icon: <StockOutlined />,
        },
        {
          key: "inventory-history",
          label: "Lịch sử nhập hàng",
          icon: <HistoryOutlined />,
        },
      ],
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {isDesktop && (
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          width={240}
          style={{ position: "sticky", top: 0, height: "100vh" }}
        >
          <div className="flex items-center gap-2 px-4 h-14 text-black text-lg font-semibold">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            Admin
          </div>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={onMenuClick}
          />
        </Sider>
      )}

      <Layout>
        <Header className="bg-white px-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle sidebar"
              onClick={() =>
                isDesktop
                  ? setCollapsed(!collapsed)
                  : setMobileOpen(!mobileOpen)
              }
              className="text-gray-700 hover:text-black"
            >
              {isDesktop ? (
                collapsed ? (
                  <MenuUnfoldOutlined />
                ) : (
                  <MenuFoldOutlined />
                )
              ) : mobileOpen ? (
                <MenuFoldOutlined />
              ) : (
                <MenuUnfoldOutlined />
              )}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <BellOutlined className="text-gray-600 text-lg" />
            <Dropdown
              menu={{ items: profileMenu, onClick: onProfileClick }}
              trigger={["click"]}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar size={32} icon={<UserOutlined />} />
                  <Text className="hidden sm:inline">Hello, Admin</Text>
                </Space>
              </a>
            </Dropdown>
          </div>
        </Header>
        <Content className="p-4 md:p-6 bg-[#f5f7fb] min-h-[calc(100vh-56px)]">
          <Outlet />
        </Content>
      </Layout>

      {/* Mobile overlay sidebar */}
      {!isDesktop && (
        <Drawer
          placement="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          width={240}
        >
          <div className="flex items-center gap-2 px-4 h-14 text-lg font-semibold">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            Admin
          </div>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={(info) => {
              onMenuClick(info);
              setMobileOpen(false);
            }}
          />
        </Drawer>
      )}
    </Layout>
  );
};
