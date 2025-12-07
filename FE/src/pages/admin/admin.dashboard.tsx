import React from 'react';
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    BarChartOutlined,
    SketchOutlined,
    StockOutlined,
} from '@ant-design/icons';
import {
    kpis,
    ordersColumns,
    ordersData,
    userOrderGrowth,
    currencyVN,
} from '@/pages/admin/data/dashboard';
import { Avatar, Card, Col, Row, Table, Typography } from 'antd';
import CountUp from 'react-countup';
import { GrowthChart } from '@/components/admin/chart/chart.dashboard';

const { Text } = Typography;

export const DashboardPage: React.FC = () => {
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
                {kpis.map(kpi => (
                    <Col xs={24} sm={12} md={12} lg={6} key={kpi.title}>
                        <Card hoverable className="shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Text type="secondary">{kpi.title}</Text>
                                    <div className="text-2xl font-semibold">
                                        {kpi.title === 'Doanh thu' ? (
                                            currencyVN(kpi.value)
                                        ) : (
                                            <CountUp end={kpi.value} separator="," />
                                        )}
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
                                    style={{
                                        backgroundColor: kpi.color,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    }}
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
                        title={
                            <span className="text-2xl">
                                <StockOutlined style={{ color: 'red' }} />
                                {'  '}
                                Tăng trưởng người dùng và đơn hàng qua 12 tháng của năm 2025
                            </span>
                        }
                        extra={<Text type="secondary">12 tháng vừa qua</Text>}
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
                    <Card
                        title={
                            <span>
                                {' '}
                                <SketchOutlined style={{ color: 'blue' }} /> Top 5 đơn hàng có giá
                                trị nhất trong năm 2025
                            </span>
                        }
                        className="shadow-sm"
                        hoverable
                    >
                        <Table
                            size="middle"
                            columns={ordersColumns as any}
                            dataSource={ordersData}
                            pagination={{ pageSize: 5 }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
