import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
    ReloadOutlined,
    ShoppingCartOutlined,
    BoxPlotOutlined,
    TagOutlined,
    PlusOutlined,
    HddOutlined,
} from '@ant-design/icons';
import {
    Card,
    Space,
    Table,
    Tag,
    type TableProps,
    Row,
    Col,
    Statistic,
    Input,
    Button,
    Tooltip,
    Avatar,
    Empty,
} from 'antd';
import { useProductsPage } from '@/components/admin/hooks/product';
import { AddProductModal } from '@/components/admin/modal/add.product.modal';

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

export const ProductPage = () => {
    const {
        dataTable,
        currentProduct,
        filters,
        handleEditProduct,
        setCurrentProduct,
        handleSearch,
        refreshProducts,
        statistics,
        meta,
        handleTableChange,
        categoriesList,
        openAddModal,
        setIsOpenAddModal,
        brandsList,
        series,
    } = useProductsPage();

    const createTableColumns = (
        onEdit: (record: IProduct) => void
    ): TableProps<IProduct>['columns'] => [
        {
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
            hidden: true,
        },
        {
            title: 'STT',
            key: 'STT',
            width: 60,
            align: 'center',
            render: (_, __, index) => (
                <span className="font-medium">
                    {((filters.page ?? 1) - 1) * (filters.limit ?? 10) + index + 1}
                </span>
            ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: (text, record) => (
                <div className="flex items-center gap-3">
                    <Avatar size={40} icon={<BoxPlotOutlined />} className="bg-blue-500" />
                    <div>
                        <div className="font-semibold text-gray-900">{text}</div>
                        <div className="text-sm text-gray-500">ID: {record.id}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Loại',
            dataIndex: 'category',
            key: 'category',
            width: 120,
            align: 'center',
            render: (_, record) => {
                return <span>{record.category.name}</span>;
            },
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100,
            align: 'center',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: quantity => (
                <span className={`font-medium ${quantity < 10 ? 'text-red-500' : 'text-gray-700'}`}>
                    {quantity}
                </span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 120,
            align: 'center',
            render: (_, record) => {
                return <span>{record.is_active === true ? 'Đang bán' : 'Ngừng bán'}</span>;
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <div className="text-sm">
                    <div className="font-medium">
                        {new Date(record.create_at).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-gray-500">
                        {new Date(record.create_at).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </div>
                </div>
            ),
            sorter: true,
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Chỉnh sửa thông tin">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => onEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa sản phẩm">
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const columns = createTableColumns(handleEditProduct);

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <HddOutlined className="text-2xl text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Quản lí kho hàng
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Nhập sản phẩm mới tại đây tại đây
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Main Content Card */}
                <Card
                    className="shadow-lg border-0"
                    title={
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-semibold text-gray-900">
                                <ShoppingCartOutlined className="mr-2" />
                                Danh sách sản phẩm
                            </span>
                            <div className="flex gap-2 items-center">
                                <div className="flex items-center gap-4">
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        size="large"
                                        onClick={() => setIsOpenAddModal(true)}
                                    >
                                        Thêm
                                    </Button>
                                    <Input.Search
                                        placeholder="Tìm kiếm theo tên, loại"
                                        allowClear
                                        enterButton={<SearchOutlined />}
                                        size="large"
                                        style={{ width: 300 }}
                                        value={filters.search || ''}
                                        onChange={e => handleSearch(e.target.value)}
                                        onSearch={handleSearch}
                                    />
                                    <Tooltip title="Làm mới">
                                        <Button
                                            icon={<ReloadOutlined />}
                                            size="large"
                                            onClick={refreshProducts}
                                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    }
                >
                    <Table
                        dataSource={dataTable}
                        columns={columns}
                        rowKey="id"
                        size="middle"
                        className="custom-table"
                        pagination={{
                            current: meta?.page || 1,
                            pageSize: meta?.limit || 10,
                            total: meta?.total || 0,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => (
                                <span className="text-gray-600">
                                    Hiển thị {range[0]}-{range[1]} của {meta?.total ?? 0} sản phẩm
                                </span>
                            ),
                            pageSizeOptions: ['5', '10', '20', '50', '100'],
                        }}
                        onChange={handleTableChange}
                        scroll={{ x: 1200 }}
                        locale={{
                            emptyText: (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={<span>Không tìm thấy sản phẩm nào.</span>}
                                />
                            ),
                        }}
                    />
                </Card>
            </div>

            {/* Add Product Modal */}
            <AddProductModal
                isModalOpen={openAddModal}
                setIsOpenModal={setIsOpenAddModal}
                brand_options={brandsList}
                category_options={categoriesList}
                serie_options={series}
                onSuccess={refreshProducts}
            />
        </>
    );
};
