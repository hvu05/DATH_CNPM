import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
    ReloadOutlined,
    BoxPlotOutlined,
    AppstoreOutlined,
    CloudDownloadOutlined,
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
import { useProductListing } from '@/components/admin/hooks/useProductListing';
import type { IProduct } from '@/types/admin/product';
import { useState } from 'react';

/**
 * Product Listing Page - Sản phẩm Website
 * - Hiển thị CHỈ các sản phẩm đang bán (is_active = true)
 * - Có thể gỡ sản phẩm khỏi web (toggle is_active = false)
 */

export const ProductPage = () => {
    const { message } = App.useApp();
    const [searchValue, setSearchValue] = useState<string>('');
    const {
        dataTable,
        filters,
        handleSearch,
        refreshProducts,
        meta,
        handleTableChange,
        handleUnpublishProduct,
        unpublishLoading,
    } = useProductListing();

    const handleUnpublish = async (record: IProduct) => {
        const success = await handleUnpublishProduct(record.id);
        if (success) {
            message.success(`Đã gỡ "${record.name}" khỏi website`);
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
                    {((meta?.page ?? 1) - 1) * (meta?.limit ?? 10) + index + 1}
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
                        />
                    ) : (
                        <Avatar size={48} icon={<BoxPlotOutlined />} className="bg-green-500" />
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
            render: (_, record) => <Tag color="green">{record.category?.name || 'N/A'}</Tag>,
        },
        {
            title: 'Tồn kho',
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
            dataIndex: 'is_active',
            width: 130,
            align: 'center',
            render: () => (
                <Tag color="success" icon={<CheckCircleOutlined />}>
                    Đang bán
                </Tag>
            ),
        },
        {
            title: 'Ngày tạo',
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
                    <Tooltip title="Gỡ khỏi website">
                        <Popconfirm
                            title="Gỡ sản phẩm khỏi website?"
                            description={`Sản phẩm "${record.name}" sẽ không hiển thị trên web`}
                            onConfirm={() => handleUnpublish(record)}
                            okText="Đồng ý"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                        >
                            <Button
                                type="text"
                                icon={<CloudDownloadOutlined />}
                                className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                                loading={unpublishLoading === record.id}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-full">
                            <AppstoreOutlined className="text-2xl text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Sản phẩm Website</h1>
                            <p className="text-gray-600 mt-1">
                                Các sản phẩm đang được hiển thị trên website
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
                            <AppstoreOutlined className="mr-2" />
                            Danh sách sản phẩm đang bán
                        </span>
                        <div className="flex gap-2 items-center">
                            <Input
                                placeholder="Tìm kiếm sản phẩm..."
                                size="large"
                                style={{ width: 300 }}
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                            />
                            <Button
                                type="primary"
                                icon={<SearchOutlined />}
                                size="large"
                                onClick={() => handleSearch(searchValue)}
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
                        pageSizeOptions: ['3', '10', '20', '50', '100'],
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 1000 }}
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Chưa có sản phẩm nào được đưa lên web"
                            />
                        ),
                    }}
                />
            </Card>
        </div>
    );
};
