import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { ArrowDownOutlined, ArrowUpOutlined, DollarOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Row, Statistic, Table, Tag, Typography } from 'antd';
import CountUp from 'react-countup';

const { Title, Text } = Typography;

const numberFormatter = (value: number) => <CountUp end={value} separator="," />;

const currency = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

type GrowthPoint = {
    period: string;
    users: number;
    orders: number;
};

const GrowthChart: React.FC<{ data: GrowthPoint[] }> = ({ data }) => {
    const option = useMemo(() => {
        const categories = data.map((point) => point.period);
        const usersSeries = data.map((point) => point.users);
        const ordersSeries = data.map((point) => point.orders);

        return {
            tooltip: { trigger: 'axis' },
            legend: {
                data: ['Users', 'Orders'],
                icon: 'circle',
            },
            grid: { top: 40, right: 16, bottom: 36, left: 48 },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisTick: { alignWithLabel: true },
                axisLine: { lineStyle: { color: '#d9d9d9' } },
                data: categories,
            },
            yAxis: {
                type: 'value',
                axisLine: { lineStyle: { color: '#d9d9d9' } },
                splitLine: { lineStyle: { type: 'dashed', color: '#e6e6e6' } },
            },
            series: [
                {
                    name: 'Users',
                    type: 'line',
                    smooth: true,
                    data: usersSeries,
                    showSymbol: false,
                    lineStyle: { width: 3, color: '#1677ff' },
                    itemStyle: { color: '#1677ff' },
                    areaStyle: { color: 'rgba(22, 119, 255, 0.12)' },
                },
                {
                    name: 'Orders',
                    type: 'line',
                    smooth: true,
                    data: ordersSeries,
                    showSymbol: false,
                    lineStyle: { width: 3, color: '#52c41a' },
                    itemStyle: { color: '#52c41a' },
                    areaStyle: { color: 'rgba(82, 196, 26, 0.12)' },
                },
            ],
        };
    }, [data]);

    return <ReactECharts option={option} style={{ height: '260px', width: '100%' }} />;
};

export const DashboardPage: React.FC = () => {
    // Demo data - replace with API calls as needed
    const kpis = [
        {
            title: 'Revenue',
            value: 128400,
            icon: <DollarOutlined />,
            trend: +12.4,
            color: '#1677ff',
        },
        {
            title: 'Orders',
            value: 2450,
            icon: <ShoppingCartOutlined />,
            trend: +3.1,
            color: '#52c41a',
        },
        {
            title: 'Customers',
            value: 980,
            icon: <UserOutlined />,
            trend: +1.8,
            color: '#faad14',
        },
        {
            title: 'Refunds',
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

    const latestPoint = userOrderGrowth[userOrderGrowth.length - 1] || { period: '', users: 0, orders: 0 };
    const previousPoint = userOrderGrowth[userOrderGrowth.length - 2] || latestPoint;

    const userGrowth = previousPoint.users
        ? ((latestPoint.users - previousPoint.users) / previousPoint.users) * 100
        : 0;

    const orderGrowth = previousPoint.orders
        ? ((latestPoint.orders - previousPoint.orders) / previousPoint.orders) * 100
        : 0;

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
        <div className="p-4 md:p-6">
            {/* header  */}
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <Title level={3} className="!mb-0">
                        E-commerce Dashboard
                    </Title>
                    <Text type="secondary">Key metrics and recent activity</Text>
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
                                        <Text type="secondary">vs last week</Text>
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
                        title="User & Order Growth"
                        extra={<Text type="secondary">Last 8 months</Text>}
                        className="shadow-sm"
                        hoverable
                    >
                        <GrowthChart data={userOrderGrowth} />

                        <Row gutter={[16, 16]} className="mt-4">
                            <Col xs={12} md={6}>
                                <Statistic
                                    title={`Users (${latestPoint.period})`}
                                    value={latestPoint.users}
                                    formatter={(v) => numberFormatter(Number(v)) as any}
                                />
                            </Col>
                            <Col xs={12} md={6}>
                                <Statistic
                                    title={`Orders (${latestPoint.period})`}
                                    value={latestPoint.orders}
                                    formatter={(v) => numberFormatter(Number(v)) as any}
                                />
                            </Col>
                            <Col xs={12} md={6}>
                                <Statistic
                                    title="User Growth"
                                    value={userGrowth}
                                    formatter={(v) => <CountUp end={Number(v)} decimals={1} suffix="%" />}
                                />
                            </Col>
                            <Col xs={12} md={6}>
                                <Statistic
                                    title="Order Growth"
                                    value={orderGrowth}
                                    formatter={(v) => <CountUp end={Number(v)} decimals={1} suffix="%" />}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            {/* Recent orders */}
            <Row gutter={[16, 16]} className="mt-2">
                <Col span={24}>
                    <Card title="Recent Orders" className="shadow-sm" hoverable>
                        <Table size="middle" columns={ordersColumns as any} dataSource={ordersData} pagination={{ pageSize: 5 }} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};