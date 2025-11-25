import type { IOrder } from '@/services/seller/seller.service';
import { MoreOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Image, Space, Tag, Typography } from 'antd';
import { getActionItems } from './order.item.menu';
import { formatCurrency, getStatusColor, getStatusText } from '@/helpers/seller/helper';
import dayjs from 'dayjs';

const { Text } = Typography;

export const OrderCard = ({ order }: { order: IOrder }) => (
    <Card
        size="small"
        className="order-card"
        style={{ width: '100%', marginBottom: 0 }}
        styles={{ body: { padding: '12px 16px' } }}
        extra={
            <Dropdown menu={{ items: getActionItems(order) }} trigger={['click']}>
                <Button type="text" icon={<MoreOutlined />} size="small" />
            </Dropdown>
        }
    >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', width: '100%' }}>
            <Image src={order.order_items[0].product_variant.thumbnail} width={100} />
            <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex justify-between items-start mb-2">
                    <Space wrap>
                        <Text strong>Mã đơn hàng: {order.id}</Text>
                        <Tag color={getStatusColor(order.status)} style={{ margin: 0 }}>
                            {getStatusText(order.status)}
                        </Tag>
                    </Space>
                </div>
                <div style={{ marginBottom: '6px' }}>
                    <Text strong className="text-base">
                        {order.order_items?.[0]?.product_variant?.name || 'Sản phẩm'}
                    </Text>
                    {order.order_items && order.order_items.length > 1 && (
                        <Text type="secondary" style={{ fontSize: '13px', marginLeft: '6px' }}>
                            (+{order.order_items.length - 1} sản phẩm khác)
                        </Text>
                    )}
                </div>
                <div className="flex gap-4 mb-3 text-base">
                    <Text>Số lượng: {order.order_items?.[0]?.quantity || 1}</Text>
                    <Text type="secondary">
                        {order.order_items?.[0]?.product_variant?.color || 'N/A'}
                    </Text>
                    <Text type="secondary">
                        {order.order_items?.[0]?.product_variant?.storage || 'N/A'}
                    </Text>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Text strong className="text-red-400 text-[1.25rem]">
                        {formatCurrency(order.total)}
                    </Text>
                    <Text type="secondary" className="text-base">
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
