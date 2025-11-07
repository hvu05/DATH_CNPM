import React from 'react';
import { ArrowDownOutlined, ArrowUpOutlined, BarChartOutlined, DollarOutlined, ShoppingCartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Row, Statistic, Table, Tag, Typography } from 'antd';
import CountUp from 'react-countup';
import { GrowthChart } from '@/components/admin/chart/chart.dashboard';

const { Title, Text } = Typography;

const numberFormatter = (value: number) => <CountUp end={value} separator="," />;

const currency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

type GrowthPoint = {
    period: string;
    users: number;
    orders: number;
};

export const DashboardPage: React.FC = () => {
    // Demo data - replace with API calls as needed
    const kpis = [
        {
            title: 'Doanh thu',
            value: 128400,
            icon: <DollarOutlined />,
            trend: +12.4,
            color: '#1677ff',
        },
        {
            title: 'Đơn hàng',
            value: 2450,
            icon: <ShoppingCartOutlined />,
            trend: +3.1,
            color: '#52c41a',
        },
        {
            title: 'Khách hàng',
            value: 980,
            icon: <UserOutlined />,
            trend: +1.8,
            color: '#faad14',
        },
        {
            title: 'Hoàn đơn',
            value: 34,
            icon: <ArrowDownOutlined />,
            trend: -0.6,
            color: '#f5222d',
        },
    ];

    const userOrderGrowth: GrowthPoint[] = [
        { period: 'Aug', users: 180, orders: 112 },
        { period: 'Sep', users: 210, orders: 135 },
        { period: 'Oct', users: 240, orders: 160 },
        { period: 'Nov', users: 260, orders: 178 },
        { period: 'Dec', users: 295, orders: 192 },
        { period: 'Jan', users: 320, orders: 210 },
        { period: 'Feb', users: 340, orders: 238 },
        { period: 'Mar', users: 360, orders: 275 },
    ];

    const ordersColumns = [
        { title: 'Order #', dataIndex: 'id', key: 'id' },
        { title: 'Customer', dataIndex: 'customer', key: 'customer' },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (v: number) => currency(v),
            align: 'right' as const,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (s: string) => {
                const map: Record<string, any> = {
                    Paid: 'green',
                    Pending: 'gold',
                    Refunded: 'red',
                };
                return <Tag color={map[s] || 'default'}>{s}</Tag>;
            },
        },
        { title: 'Date', dataIndex: 'date', key: 'date' },
    ];

    const ordersData = [
        { key: 1, id: 'INV-1045', customer: 'Jane Cooper', total: 289, status: 'Paid', date: '2025-09-14' },
        { key: 2, id: 'INV-1046', customer: 'Cody Fisher', total: 159, status: 'Pending', date: '2025-09-13' },
        { key: 3, id: 'INV-1047', customer: 'Devon Lane', total: 540, status: 'Paid', date: '2025-09-13' },
        { key: 4, id: 'INV-1048', customer: 'Eleanor Pena', total: 120, status: 'Refunded', date: '2025-09-12' },
    ];

    return (
        <div className="space-y-6">
            {/* header  */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <BarChartOutlined className="text-2xl text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-gray-600 mt-1">Tổng quan hoạt động của cửa hàng</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI cards */}
            <Row gutter={[16, 16]}>
                {kpis.map((kpi) => (
                    <Col xs={24} sm={12} md={12} lg={6} key={kpi.title}>
                        <Card hoverable className="shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Text type="secondary">{kpi.title}</Text>
                                    <div className="text-2xl font-semibold">
                                        {kpi.title === 'Revenue' ? currency(kpi.value) : <CountUp end={kpi.value} separator="," />}
                                    </div>
                                    <div className="mt-1 flex items-center gap-2">
                                        {kpi.trend >= 0 ? (
                                            <Text type="success">
                                                <ArrowUpOutlined /> {kpi.trend}%
                                            </Text>
                                        ) : (
                                            <Text type="danger">
                                                <ArrowDownOutlined /> {Math.abs(kpi.trend)}%
                                            </Text>
                                        )}
                                        <Text type="secondary">so với tuần trước</Text>
                                    </div>
                                </div>
                                <Avatar
                                    size={44}
                                    style={{ backgroundColor: kpi.color, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                                    icon={kpi.icon}
                                />
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Growth chart */}
            <Row gutter={[16, 16]} className="mt-2">
                <Col span={24}>
                    <Card
                        title="Tăng trưởng người dùng và đơn hàng"
                        extra={<Text type="secondary">Last 8 months</Text>}
                        className="shadow-sm"
                        hoverable
                    >
                        <GrowthChart data={userOrderGrowth} />
                    </Card>
                </Col>
            </Row>

            {/* Recent orders */}
            <Row gutter={[16, 16]} className="mt-2">
                <Col span={24}>
                    <Card title="Đơn hàng gần đây" className="shadow-sm" hoverable>
                        <Table size="middle" columns={ordersColumns as any} dataSource={ordersData} pagination={{ pageSize: 5 }} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
