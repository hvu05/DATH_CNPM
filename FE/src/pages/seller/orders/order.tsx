import { useEffect, useState } from 'react';
import './order.scss';
import { useNavigate } from 'react-router';
import { ProductOutlined, SearchOutlined, MoreOutlined, UserOutlined } from '@ant-design/icons';
import {
    Layout,
    Card,
    Row,
    Col,
    Typography,
    Space,
    List,
    Avatar,
    Tag,
    Button,
    Input,
    InputNumber,
    Checkbox,
    DatePicker,
    Dropdown,
    Skeleton,
    Empty,
    Select,
    Radio,
    message,
} from 'antd';
import type { MenuProps } from 'antd';
import dayjs from 'dayjs';
import { getAllOrders, type IGetOrdersParams, type IOrder } from '@/services/seller/seller.service';
import defaulProduct from '@/assets/seller/default_order.webp';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

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
    const [params, setParams] = useState<IGetOrdersParams>({ page: 1, limit: 10 });
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    // Get status color and text
    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: 'orange',
            CONFIRMED: 'blue',
            PROCESSING: 'cyan',
            DELIVERING: 'purple',
            COMPLETED: 'green',
            CANCELLED: 'red',
        };
        return colors[status] || 'default';
    };

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = {
            PENDING: 'Chờ xác nhận',
            CONFIRMED: 'Đã xác nhận',
            PROCESSING: 'Đang xử lý',
            DELIVERING: 'Đang giao',
            COMPLETED: 'Hoàn thành',
            CANCELLED: 'Đã hủy',
        };
        return texts[status] || status;
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    // Action buttons for order
    const getActionItems = (order: IOrder): MenuProps['items'] => {
        const items: MenuProps['items'] = [
            {
                key: 'detail',
                label: 'Chi tiết đơn hàng',
                onClick: () => navigate(`/seller/order/${order.id}`, { state: { order } }),
            },
        ];

        // Add action buttons based on status
        if (order.status === 'PENDING') {
            items.push(
                { type: 'divider' },
                {
                    key: 'confirm',
                    label: 'Xác nhận đơn',
                    danger: false,
                },
                {
                    key: 'cancel',
                    label: 'Hủy đơn',
                    danger: true,
                }
            );
        }

        return items;
    };

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
        setFilters({});
        setSearchText('');
        setParams({ page: 1, limit: 10 });
    };

    // Load orders on component mount and when filters change
    useEffect(() => {
        loadOrders();
    }, [params]);

    // Order card component
    const OrderCard = ({ order }: { order: IOrder }) => (
        <Card
            size="small"
            className="order-card"
            style={{ width: '100%', marginBottom: 0 }}
            bodyStyle={{ padding: '12px 16px' }}
            extra={
                <Dropdown menu={{ items: getActionItems(order) }} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} size="small" />
                </Dropdown>
            }
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', width: '100%' }}>
                <Avatar
                    size={64}
                    src={defaulProduct}
                    icon={<UserOutlined />}
                    style={{ flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '8px',
                        }}
                    >
                        <Space wrap>
                            <Text strong>Mã đơn hàng: #{order.id}</Text>
                            <Tag color={getStatusColor(order.status)} style={{ margin: 0 }}>
                                {getStatusText(order.status)}
                            </Tag>
                        </Space>
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                        <Text strong style={{ fontSize: '14px' }}>
                            {order.order_items?.[0]?.product_variant?.name || 'Sản phẩm'}
                        </Text>
                        {order.order_items && order.order_items.length > 1 && (
                            <Text type="secondary" style={{ fontSize: '13px', marginLeft: '6px' }}>
                                (+{order.order_items.length - 1} sản phẩm khác)
                            </Text>
                        )}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            gap: '16px',
                            marginBottom: '6px',
                            fontSize: '13px',
                        }}
                    >
                        <Text>Số lượng: {order.order_items?.[0]?.quantity || 1}</Text>
                        <Text type="secondary">
                            {order.order_items?.[0]?.product_variant?.color || 'N/A'}
                        </Text>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Text strong style={{ fontSize: '18px', color: 'red' }}>
                            {formatCurrency(order.total)}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '16px' }}>
                            {dayjs(order.create_at).format('DD/MM/YYYY HH:mm')}
                        </Text>
                    </div>
                    {order.note && (
                        <Text
                            type="secondary"
                            style={{ fontSize: '16px', marginTop: '4px', display: 'block' }}
                        >
                            Ghi chú: {order.note}
                        </Text>
                    )}
                </div>
            </div>
        </Card>
    );

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
                    <Card title="Bộ lọc" size="small" style={{ height: 'fit-content' }}>
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            {/* Status Filter */}
                            <div>
                                <Text strong>Trạng thái</Text>
                                <Select
                                    style={{ width: '100%', marginTop: 8 }}
                                    placeholder="Chọn trạng thái"
                                    allowClear
                                    value={filters.status}
                                    onChange={value =>
                                        setFilters({ ...filters, status: value as string })
                                    }
                                    options={[
                                        { value: 'PENDING', label: 'Chờ xác nhận' },
                                        { value: 'CONFIRMED', label: 'Đã xác nhận' },
                                        { value: 'PROCESSING', label: 'Đang xử lý' },
                                        { value: 'DELIVERING', label: 'Đang giao' },
                                        { value: 'COMPLETED', label: 'Hoàn thành' },
                                        { value: 'CANCELLED', label: 'Đã hủy' },
                                    ]}
                                />
                            </div>

                            {/* Price Range */}
                            <div>
                                <Text strong>Khoảng giá</Text>
                                <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
                                    <InputNumber
                                        placeholder="Giá tối thiểu"
                                        style={{ width: '100%' }}
                                        formatter={value =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                        }
                                        parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                                        onChange={value =>
                                            setFilters({
                                                ...filters,
                                                minPrice: (value as number) || undefined,
                                            })
                                        }
                                    />
                                    <InputNumber
                                        placeholder="Giá tối đa"
                                        style={{ width: '100%' }}
                                        formatter={value =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                        }
                                        parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                                        onChange={value =>
                                            setFilters({
                                                ...filters,
                                                maxPrice: (value as number) || undefined,
                                            })
                                        }
                                    />
                                </Space>
                            </div>

                            {/* Date Range */}
                            <div>
                                <Text strong>Khoảng thời gian</Text>
                                <RangePicker
                                    style={{ width: '100%', marginTop: 8 }}
                                    onChange={dates =>
                                        setFilters({ ...filters, dateRange: dates as any })
                                    }
                                />
                            </div>

                            {/* Action Buttons */}
                            <Space>
                                <Button type="primary" onClick={applyFilters}>
                                    Lọc
                                </Button>
                                <Button onClick={resetFilters}>Đặt lại</Button>
                            </Space>
                        </Space>
                    </Card>
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
            </Row>
        </div>
    );
};
