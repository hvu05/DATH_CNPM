import {
    SearchOutlined,
    ReloadOutlined,
    HddOutlined,
    BoxPlotOutlined,
    PlusOutlined,
    CloudUploadOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import {
    Card,
    Space,
    Table,
    Tag,
    type TableProps,
    Input,
    Button,
    Tooltip,
    Avatar,
    Empty,
    App,
    Popconfirm,
    Image,
} from 'antd';
import { useWarehouse } from '@/components/admin/hooks/useWarehouse';
import { AddProductModal } from '@/components/admin/modal/add.product.modal';
import type { IProduct } from '@/types/admin/product';
import default_product from '@/assets/seller/default_order.webp';

/**
 * Warehouse Page - Quản lý kho hàng
 * - Thêm mới sản phẩm
 * - Xem tất cả sản phẩm (cả active và inactive)
 * - Đưa sản phẩm lên web (toggle is_active)
 */
export const WarehousePage = () => {
    const { message } = App.useApp();
    const {
        dataTable,
        filters,
        handleSearch,
        refreshProducts,
        meta,
        handleTableChange,
        categoriesList,
        openAddModal,
        setIsOpenAddModal,
        brandsList,
        series,
        handlePublishProduct,
        publishLoading,
        refreshSelectOptions,
    } = useWarehouse();

    const handlePublish = async (record: IProduct) => {
        const success = await handlePublishProduct(record.id, true);
        if (success) {
            message.success(`Đã đưa "${record.name}" lên website`);
        }
    };

    const columns: TableProps<IProduct>['columns'] = [
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
                    {record.thumbnail ? (
                        <Image
                            src={record.thumbnail}
                            alt={text}
                            width={48}
                            height={48}
                            className="rounded-lg object-cover"
                            fallback={default_product}
                        />
                    ) : (
                        <Avatar size={48} icon={<BoxPlotOutlined />} className="bg-blue-500" />
                    )}
                    <div>
                        <div className="font-semibold text-gray-900">{text}</div>
                        <div className="text-sm text-gray-500">ID: {record.id}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            width: 120,
            align: 'center',
            render: (_, record) => <Tag color="blue">{record.category?.name || 'N/A'}</Tag>,
        },
        {
            title: 'Tồn kho',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100,
            align: 'start',
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: quantity => (
                <span className={`font-medium ${quantity < 10 ? 'text-red-500' : 'text-gray-700'}`}>
                    {quantity}
                </span>
            ),
        },
        {
            title: 'Thương hiệu',
            dataIndex: 'brand',
            key: 'brand',
            width: 100,
            align: 'start',
            render: (_, record) => <span>{record.brand?.name ?? 'unknown'}</span>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'is_active',
            width: 130,
            align: 'center',
            render: (_, record) =>
                record.is_active ? (
                    <Tag color="success" icon={<CheckCircleOutlined />}>
                        Đang bán
                    </Tag>
                ) : (
                    <Tag color="default">Trong kho</Tag>
                ),
        },
        {
            title: 'Ngày nhập',
            dataIndex: 'create_at',
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
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space>
                    {!record.is_active && (
                        <Tooltip title="Đưa lên website">
                            <Popconfirm
                                title="Đưa sản phẩm lên website?"
                                description={`Sản phẩm "${record.name}" sẽ được hiển thị trên web`}
                                onConfirm={() => handlePublish(record)}
                                okText="Đồng ý"
                                cancelText="Hủy"
                            >
                                <Button
                                    type="text"
                                    icon={<CloudUploadOutlined />}
                                    className="text-green-500 hover:text-green-600 hover:bg-green-50"
                                    loading={publishLoading === record.id}
                                />
                            </Popconfirm>
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-orange-100 p-3 rounded-full">
                                <HddOutlined className="text-2xl text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Kho hàng</h1>
                                <p className="text-gray-600 mt-1">
                                    Nhập sản phẩm mới và quản lý tồn kho
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
                                <HddOutlined className="mr-2" />
                                Danh sách sản phẩm trong kho
                            </span>
                            <div className="flex gap-2 items-center">
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    size="large"
                                    onClick={() => setIsOpenAddModal(true)}
                                >
                                    Nhập hàng mới
                                </Button>
                                <Input.Search
                                    placeholder="Tìm kiếm sản phẩm..."
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
                                    />
                                </Tooltip>
                            </div>
                        </div>
                    }
                >
                    <Table
                        dataSource={dataTable}
                        columns={columns}
                        rowKey="id"
                        size="middle"
                        pagination={{
                            current: meta?.page || 1,
                            pageSize: meta?.limit || 10,
                            total: meta?.total || 0,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => (
                                <span className="text-gray-600">
                                    Hiển thị {range[0]}-{range[1]} của {total} sản phẩm
                                </span>
                            ),
                            pageSizeOptions: ['10', '20', '50', '100'],
                        }}
                        onChange={handleTableChange}
                        scroll={{ x: 1000 }}
                        locale={{
                            emptyText: (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="Chưa có sản phẩm nào trong kho"
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
                onRefreshOptions={refreshSelectOptions}
            />
        </>
    );
};
