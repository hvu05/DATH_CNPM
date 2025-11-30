import { useEffect, useState } from 'react';
import './order.scss';
import { ProductOutlined, SearchOutlined } from '@ant-design/icons';
import { OrderCard } from '@/components/seller/order/order.item.card';
import { Row, Col, Typography, List, Input, Skeleton, Empty, Pagination, App } from 'antd';
import dayjs from 'dayjs';
import { getAllOrders, type IGetOrdersParams, type IOrder } from '@/services/seller/seller.service';
import { OrderFilter } from '@/components/seller/order/order.filter';

const { Title } = Typography;

// Filter states
interface FilterState {
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    dateRange?: [dayjs.Dayjs, dayjs.Dayjs];
    search?: string;
}

export const OrderPage = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<FilterState>({});
    const [params, setParams] = useState<IGetOrdersParams>({ page: 1, limit: 3 });
    const [searchText, setSearchText] = useState('');
    const [totalOrders, setTotalOrders] = useState(0);
    const { message } = App.useApp();

    // Load orders
    const loadOrders = async () => {
        setLoading(true);
        try {
            const requestParams: IGetOrdersParams = {
                ...params,
                status: filters.status as any,
                search: filters.search || searchText,
                min_price: filters.minPrice,
                max_price: filters.maxPrice,
                start_date: filters.dateRange?.[0]?.toDate(),
                end_date: filters.dateRange?.[1]?.toDate(),
            };

            const result = await getAllOrders(requestParams);
            if (result.success && result.data) {
                setOrders(result.data.orders || []);
                console.log(result.data.orders);
                setTotalOrders(result.data.count || 0);
            }
        } catch (error) {
            console.error('Failed to load orders:', error);
            message.error('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    // Apply filters
    const applyFilters = () => {
        loadOrders();
    };

    // Reset filters
    const resetFilters = () => {
        // setFilters({});
        // setSearchText('');
        // setParams({ page: 1, limit: 3 });
        window.location.reload();
    };

    // Handle pagination change
    const handlePageChange = (page: number, pageSize?: number) => {
        setParams({
            ...params,
            page: page,
            limit: pageSize || params.limit,
        });
    };

    // Load orders on component mount and when filters change
    useEffect(() => {
        loadOrders();
    }, [params]);

    // Order card component

    return (
        <div className="seller-order">
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={2}>
                        <ProductOutlined /> Quản lý đơn hàng
                    </Title>
                </Col>
                <Col>
                    <Input
                        placeholder="Tìm kiếm nhanh theo mã đơn hàng, tên sản phẩm..."
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        onPressEnter={loadOrders}
                        allowClear
                    />
                </Col>
            </Row>

            <Row gutter={[12, 12]}>
                {/* Filter Sidebar */}
                <Col xs={24} lg={5}>
                    <OrderFilter
                        applyFilters={applyFilters}
                        resetFilters={resetFilters}
                        filters={filters}
                        setFilters={setFilters}
                    />
                </Col>

                {/* Order List */}
                <Col xs={24} lg={19}>
                    {loading ? (
                        <Skeleton active paragraph={{ rows: 4 }} />
                    ) : orders.length === 0 ? (
                        <Empty
                            description="Không có đơn hàng nào"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : (
                        <List
                            dataSource={orders}
                            renderItem={order => (
                                <List.Item style={{ padding: '0 0 12px 0' }}>
                                    <OrderCard order={order} />
                                </List.Item>
                            )}
                        />
                    )}
                </Col>

                {/* Pagination  */}
                <div className="flex w-full justify-end" style={{ marginTop: '24px' }}>
                    <Pagination
                        current={params.page}
                        pageSize={params.limit}
                        total={totalOrders}
                        onChange={handlePageChange}
                        onShowSizeChange={handlePageChange}
                        showSizeChanger
                        showQuickJumper
                        showTotal={(total, range) =>
                            `${range[0]}-${range[1]} của ${total} đơn hàng`
                        }
                        pageSizeOptions={['3', '5', '10', '20', '50']}
                    />
                </div>
            </Row>
        </div>
    );
};
