import {
    ArrowDownOutlined,
    DollarOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from '@ant-design/icons';

export const currencyVN = (n: number) =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(n);

export type GrowthPoint = {
    period: string;
    users: number;
    orders: number;
};

export const kpis = [
    {
        title: 'Doanh thu',
        value: 128_000_000,
        icon: <DollarOutlined />,
        trend: +12.4,
        color: '#1677ff',
    },
    {
        title: 'Đơn hàng',
        value: 24,
        icon: <ShoppingCartOutlined />,
        trend: +3.1,
        color: '#52c41a',
    },
    {
        title: 'Khách hàng',
        value: 28,
        icon: <UserOutlined />,
        trend: +1.8,
        color: '#faad14',
    },
    {
        title: 'Hoàn đơn',
        value: 3,
        icon: <ArrowDownOutlined />,
        trend: -0.6,
        color: '#f5222d',
    },
];

export const userOrderGrowth: GrowthPoint[] = [
    { period: 'T1', users: 320, orders: 210 },
    { period: 'T2', users: 340, orders: 238 },
    { period: 'T3', users: 360, orders: 275 },
    { period: 'T4', users: 20, orders: 50 },
    { period: 'T5', users: 210, orders: 135 },
    { period: 'T6', users: 50, orders: 16 },
    { period: 'T7', users: 260, orders: 178 },
    { period: 'T8', users: 29, orders: 90 },
    { period: 'T9', users: 295, orders: 192 },
    { period: 'T10', users: 295, orders: 190 },
    { period: 'T11', users: 100, orders: 290 },
    { period: 'T12', users: 300, orders: 100 },
];

export const ordersColumns = [
    { title: 'Mã đơn hàng', dataIndex: 'id', key: 'id' },
    { title: 'Tên khác hàng', dataIndex: 'customer', key: 'customer' },
    {
        title: 'Tổng hóa đơn',
        dataIndex: 'total',
        key: 'total',
        render: (v: number) => currencyVN(v),
    },
    { title: 'Ngày tạo', dataIndex: 'date', key: 'date' },
];

export const ordersData = [
    {
        key: 1,
        id: 'ORD-009',
        customer: 'Lê Văn Sĩ',
        total: 32_000_000,
        date: '2025-09-14',
    },
    {
        key: 2,
        id: 'ORD-019',
        customer: 'Lê Nguyễn Văn Sĩ',
        total: 28_000_000,
        date: '2025-09-03',
    },
    {
        key: 3,
        id: 'ORD-029',
        customer: 'Lê Văn Nghĩa',
        total: 21_000_000,
        date: '2025-09-23',
    },
    {
        key: 4,
        id: 'ORD-034',
        customer: 'Bùi Kim Ngân',
        total: 18_000_000,
        date: '2025-09-14',
    },
    {
        key: 5,
        id: 'ORD-012',
        customer: 'Nguyễn Như',
        total: 8_000_000,
        date: '2025-09-12',
    },
];
