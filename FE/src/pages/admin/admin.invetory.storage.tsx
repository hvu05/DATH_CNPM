import React, { useMemo, useState } from 'react';
import {
    Button,
    Card,
    Input,
    Space,
    Table,
    Typography,
    Modal,
    Form,
    InputNumber,
    Select,
    Tag,
    Statistic,
    Row,
    Col,
} from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import {
    ReloadOutlined,
    SearchOutlined,
    PlusOutlined,
    InboxOutlined,
    BoxPlotOutlined,
    WarningOutlined,
    HddOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { AddProductModal } from '@/components/admin/modal/add.product.modal';
import type { IBrand } from '@/services/admin/products/admin.product.api';
import { useProductsPage } from '@/components/admin/hooks/product';

const { Title, Text } = Typography;

type ProductStatus = 'new' | 'in-stock' | 'low-stock';

interface InventoryProduct {
    id: string;
    name: string;
    quantity: number;
    sold: number;
    importTime: string;
    lastSaleTime: string | null;
    category: string;
    price: number;
    status: ProductStatus;
}

export type Category = 'Laptop' | 'Phone' | 'Tablet';

export interface IProduct {
    id: string;
    name: string;
    description: string;
    category: {
        id: number;
        name: Category;
    };
    quantity: number;
    is_active: boolean;
    create_at: Date;
    update_at: Date;
}

export interface IProductStatics {
    totalProducts: number;
    activeProducts: number;
    totalSold: number;
    totalRevenue: number;
}

// Fake data with realistic timestamps for status calculation
const INVENTORY_PRODUCTS: InventoryProduct[] = [
    {
        id: 'P001',
        name: 'Arabica Beans 1kg',
        quantity: 150,
        sold: 45,
        importTime: '2024-10-01T09:15:00Z',
        lastSaleTime: '2024-10-04T14:20:00Z',
        category: 'Coffee Beans',
        price: 250000,
        status: 'new',
    },
    {
        id: 'P002',
        name: 'Robusta Beans 500g',
        quantity: 240,
        sold: 120,
        importTime: '2024-09-15T12:30:00Z',
        lastSaleTime: '2024-09-20T11:30:00Z',
        category: 'Coffee Beans',
        price: 180000,
        status: 'in-stock',
    },
    {
        id: 'P003',
        name: 'Glass Bottles 250ml',
        quantity: 480,
        sold: 320,
        importTime: '2024-09-10T08:45:00Z',
        lastSaleTime: '2024-09-25T16:45:00Z',
        category: 'Packaging',
        price: 15000,
        status: 'in-stock',
    },
    {
        id: 'P004',
        name: 'Organic Milk 1L',
        quantity: 3,
        sold: 297,
        importTime: '2024-10-02T10:10:00Z',
        lastSaleTime: '2024-10-05T09:15:00Z',
        category: 'Dairy',
        price: 45000,
        status: 'low-stock',
    },
    {
        id: 'P005',
        name: 'Brown Sugar 5kg',
        quantity: 60,
        sold: 40,
        importTime: '2024-09-28T16:25:00Z',
        lastSaleTime: '2024-10-03T13:40:00Z',
        category: 'Sweeteners',
        price: 120000,
        status: 'new',
    },
    {
        id: 'P006',
        name: 'Packing Box Medium',
        quantity: 2,
        sold: 198,
        importTime: '2024-08-20T07:55:00Z',
        lastSaleTime: '2024-09-15T10:20:00Z',
        category: 'Packaging',
        price: 8000,
        status: 'low-stock',
    },
    {
        id: 'P007',
        name: 'Vanilla Syrup 750ml',
        quantity: 110,
        sold: 90,
        importTime: '2024-08-15T11:05:00Z',
        lastSaleTime: '2024-09-01T14:30:00Z',
        category: 'Flavors',
        price: 85000,
        status: 'in-stock',
    },
    {
        id: 'P008',
        name: 'Cocoa Powder 1kg',
        quantity: 4,
        sold: 71,
        importTime: '2024-10-03T14:50:00Z',
        lastSaleTime: '2024-10-05T11:25:00Z',
        category: 'Ingredients',
        price: 95000,
        status: 'low-stock',
    },
    {
        id: 'P009',
        name: 'Paper Cups 12oz',
        quantity: 180,
        sold: 120,
        importTime: '2024-09-25T13:20:00Z',
        lastSaleTime: '2024-10-04T15:10:00Z',
        category: 'Packaging',
        price: 12000,
        status: 'new',
    },
    {
        id: 'P010',
        name: 'Caramel Sauce 500ml',
        quantity: 85,
        sold: 65,
        importTime: '2024-08-10T09:45:00Z',
        lastSaleTime: '2024-08-25T12:15:00Z',
        category: 'Flavors',
        price: 65000,
        status: 'in-stock',
    },
];

const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
});

export const InventoryStoragePage = () => {
    const [searchValue, setSearchValue] = useState('');
    const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all');
    const [products, setProducts] = useState<InventoryProduct[]>(INVENTORY_PRODUCTS);
    const [currentProduct, setCurrentProduct] = useState<IProduct | null>(null);
    const { brandsList, categoriesList, series, openAddModal, setIsOpenAddModal } =
        useProductsPage();

    // Calculate statistics
    const statistics = useMemo(() => {
        const newGoods = products.filter(p => p.status === 'new').length;
        const inStock = products.filter(p => p.status === 'in-stock').length;
        const lowStock = products.filter(p => p.status === 'low-stock').length;

        return { newGoods, inStock, lowStock };
    }, [products]);

    const getStatusTag = (status: ProductStatus) => {
        const statusConfig = {
            new: { color: 'green', text: 'Hàng mới', icon: <InboxOutlined /> },
            'in-stock': { color: 'blue', text: 'Tồn kho', icon: <BoxPlotOutlined /> },
            'low-stock': { color: 'orange', text: 'Sắp hết', icon: <WarningOutlined /> },
        };

        const config = statusConfig[status];
        return (
            <Tag color={config.color} icon={config.icon}>
                {config.text}
            </Tag>
        );
    };

    const columns: ColumnsType<InventoryProduct> = useMemo(
        () => [
            {
                title: 'ID',
                dataIndex: 'id',
                sorter: (a, b) => a.id.localeCompare(b.id),
                sortDirections: ['ascend', 'descend'],
                width: 100,
            },
            {
                title: 'Tên sản phẩm',
                dataIndex: 'name',
                sorter: (a, b) => a.name.localeCompare(b.name),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'Danh mục',
                dataIndex: 'category',
                filters: [
                    { text: 'Coffee Beans', value: 'Coffee Beans' },
                    { text: 'Packaging', value: 'Packaging' },
                    { text: 'Dairy', value: 'Dairy' },
                    { text: 'Sweeteners', value: 'Sweeteners' },
                    { text: 'Flavors', value: 'Flavors' },
                    { text: 'Ingredients', value: 'Ingredients' },
                ],
                onFilter: (value, record) => record.category === value,
            },
            {
                title: 'Số lượng',
                dataIndex: 'quantity',
                align: 'right',
                sorter: (a, b) => a.quantity - b.quantity,
                sortDirections: ['ascend', 'descend'],
                render: (quantity: number) => (
                    <Text strong={quantity < 10} type={quantity < 5 ? 'danger' : undefined}>
                        {quantity.toLocaleString()}
                    </Text>
                ),
            },
            // {
            //     title: 'Đã bán',
            //     dataIndex: 'sold',
            //     align: 'right',
            //     sorter: (a, b) => a.sold - b.sold,
            //     sortDirections: ['ascend', 'descend'],
            //     render: (sold: number) => sold.toLocaleString(),
            // },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                filters: [
                    { text: 'Hàng mới', value: 'new' },
                    { text: 'Tồn kho', value: 'in-stock' },
                    { text: 'Sắp hết', value: 'low-stock' },
                ],
                onFilter: (value, record) => record.status === value,
                render: (status: ProductStatus) => getStatusTag(status),
            },
            {
                title: 'Nhập lần cuối',
                dataIndex: 'importTime',
                render: (value: string) => timeFormatter.format(new Date(value)),
                sorter: (a, b) =>
                    new Date(a.importTime).getTime() - new Date(b.importTime).getTime(),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'Thao tác',
                key: 'actions',
                align: 'center',
                render: (_, record) => (
                    <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => setIsOpenAddModal(true)}
                    >
                        Nhập hàng
                    </Button>
                ),
            },
        ],
        []
    );

    const filteredData = useMemo(() => {
        let filtered = products;

        // Search filter
        if (searchValue.trim()) {
            const keyword = searchValue.trim().toLowerCase();
            filtered = filtered.filter(
                product =>
                    product.name.toLowerCase().includes(keyword) ||
                    product.id.toLowerCase().includes(keyword)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(product => product.status === statusFilter);
        }

        return filtered;
    }, [products, searchValue, statusFilter]);

    const handleTableChange: TableProps<InventoryProduct>['onChange'] = (
        _pagination,
        filters,
        _sorter
    ) => {
        // Handle filters if needed
    };

    const handleImportClick = (product: InventoryProduct) => {};

    const handleResetFilters = () => {
        setSearchValue('');
        setStatusFilter('all');
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <HddOutlined className="text-2xl text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Quản lí kho hàng</h1>
                            <p className="text-gray-600 mt-1">Trang thông tin thống kê tồn kho</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <Row gutter={16} className="mb-6">
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Hàng mới"
                            value={statistics.newGoods}
                            prefix={<InboxOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                        <div className="text-xs text-gray-500 mt-2">Nhập trong 7 ngày qua</div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tồn kho"
                            value={statistics.inStock}
                            prefix={<BoxPlotOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                        <div className="text-xs text-gray-500 mt-2">Lâu chưa bán được</div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Sắp hết"
                            value={statistics.lowStock}
                            prefix={<WarningOutlined />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                        <div className="text-xs text-gray-500 mt-2">Số lượng dưới 5</div>
                    </Card>
                </Col>
            </Row>

            <Card className="shadow-sm" hoverable>
                <Space direction="horizontal" size={[16, 16]} wrap className="mb-4 w-full">
                    <Input
                        allowClear
                        style={{ maxWidth: 280 }}
                        value={searchValue}
                        onChange={event => setSearchValue(event.target.value)}
                        prefix={<SearchOutlined />}
                        placeholder="Tìm theo tên hoặc ID sản phẩm"
                    />

                    <Select
                        value={statusFilter}
                        onChange={setStatusFilter}
                        style={{ width: 150 }}
                        placeholder="Lọc trạng thái"
                        options={[
                            { value: 'all', label: 'Tất cả' },
                            { value: 'new', label: 'Hàng mới' },
                            { value: 'in-stock', label: 'Tồn kho' },
                            { value: 'low-stock', label: 'Sắp hết' },
                        ]}
                    />

                    <Button
                        icon={<ReloadOutlined />}
                        onClick={handleResetFilters}
                        disabled={!searchValue.trim() && statusFilter === 'all'}
                    >
                        Đặt lại
                    </Button>
                </Space>

                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={filteredData}
                    onChange={handleTableChange}
                    pagination={{
                        pageSize: 8,
                        showSizeChanger: false,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} sản phẩm`,
                    }}
                    scroll={{ x: 800 }}
                />
            </Card>

            {/* Import Modal */}
            <AddProductModal
                isModalOpen={openAddModal}
                brand_options={brandsList}
                category_options={categoriesList}
                serie_options={series}
                setIsOpenModal={setIsOpenAddModal}
            />
        </div>
    );
};
