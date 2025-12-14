import {
    HistoryOutlined,
    SearchOutlined,
    ReloadOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    SwapOutlined,
    RollbackOutlined,
} from '@ant-design/icons';
import { Card, Table, Tag, Input, Select, Button, Statistic, Row, Col, App } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useState, useEffect } from 'react';
import {
    getInventoryLogsAPI,
    getInventorySummaryAPI,
    type IInventoryLog,
    type IInventorySummary,
    type IInventoryLogParams,
} from '@/services/admin/inventory/inventory.api';

const priceFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

export const InventoryHistoryPage = () => {
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<IInventoryLog[]>([]);
    const [summary, setSummary] = useState<IInventorySummary | null>(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [filters, setFilters] = useState<IInventoryLogParams>({
        page: 1,
        limit: 10,
        type: undefined,
        search: '',
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [logsRes, summaryRes] = await Promise.all([
                getInventoryLogsAPI(filters),
                getInventorySummaryAPI(),
            ]);

            if (logsRes.success && logsRes.data) {
                setData(logsRes.data.results);
                setPagination(prev => ({
                    ...prev,
                    current: logsRes.data!.meta.page,
                    total: logsRes.data!.meta.total,
                }));
            }

            if (summaryRes.success && summaryRes.data) {
                setSummary(summaryRes.data);
            }
        } catch (error) {
            message.error('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters]);

    const handleTableChange = (pag: TablePaginationConfig) => {
        setFilters(prev => ({
            ...prev,
            page: pag.current || 1,
            limit: pag.pageSize || 10,
        }));
    };

    const handleSearch = (value: string) => {
        setFilters(prev => ({ ...prev, search: value, page: 1 }));
    };

    const handleTypeFilter = (value: string | null) => {
        setFilters(prev => ({
            ...prev,
            type: value ? (value as 'IN' | 'OUT' | 'RETURNED') : undefined,
            page: 1,
        }));
    };

    const columns: ColumnsType<IInventoryLog> = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 80,
            align: 'center',
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            width: 120,
            align: 'center',
            render: (type: 'IN' | 'OUT' | 'RETURNED') => {
                const config = {
                    IN: { color: 'green', icon: <ArrowDownOutlined />, label: 'NHẬP' },
                    OUT: { color: 'red', icon: <ArrowUpOutlined />, label: 'XUẤT' },
                    RETURNED: { color: 'orange', icon: <RollbackOutlined />, label: 'TRẢ HÀNG' },
                };
                const { color, icon, label } = config[type] || config.IN;
                return (
                    <Tag color={color} icon={icon}>
                        {label}
                    </Tag>
                );
            },
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'product_name',
            ellipsis: true,
            render: (name, record) => (
                <div>
                    <div className="font-medium text-gray-900">{name}</div>
                    <div className="text-xs text-gray-500">{record.variant_info}</div>
                </div>
            ),
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            width: 150,
            render: cat => <Tag color="blue">{cat}</Tag>,
        },
        {
            title: 'Thương hiệu',
            dataIndex: 'brand',
            width: 120,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            width: 100,
            align: 'right',
            render: (qty, record) => {
                const colorClass =
                    {
                        IN: 'text-green-600',
                        OUT: 'text-red-600',
                        RETURNED: 'text-orange-600',
                    }[record.type] || 'text-gray-600';
                const prefix = record.type === 'OUT' ? '-' : '+';
                return (
                    <span className={`${colorClass} font-semibold`}>
                        {prefix}
                        {qty}
                    </span>
                );
            },
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            width: 140,
            align: 'right',
            render: price => priceFormatter.format(price),
        },
        {
            title: 'Lý do',
            dataIndex: 'reason',
            ellipsis: true,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <HistoryOutlined className="text-2xl text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Lịch sử nhập xuất kho
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Theo dõi các giao dịch nhập xuất hàng hóa
                            </p>
                        </div>
                    </div>
                    <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>
                        Làm mới
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <Row gutter={16}>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Tổng nhập kho"
                            value={summary?.totalIn || 0}
                            prefix={<ArrowDownOutlined className="text-green-500" />}
                            valueStyle={{ color: '#22c55e' }}
                            suffix="sản phẩm"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Tổng xuất kho"
                            value={summary?.totalOut || 0}
                            prefix={<ArrowUpOutlined className="text-red-500" />}
                            valueStyle={{ color: '#ef4444' }}
                            suffix="sản phẩm"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Tổng trả hàng"
                            value={summary?.totalReturned || 0}
                            prefix={<RollbackOutlined className="text-orange-500" />}
                            valueStyle={{ color: '#f97316' }}
                            suffix="sản phẩm"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Tổng giao dịch"
                            value={summary?.totalLogs || 0}
                            prefix={<SwapOutlined className="text-blue-500" />}
                            valueStyle={{ color: '#3b82f6' }}
                            suffix="lượt"
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters & Table */}
            <Card>
                <div className="mb-4 flex flex-wrap gap-4">
                    <Input.Search
                        placeholder="Tìm theo tên sản phẩm..."
                        allowClear
                        onSearch={handleSearch}
                        style={{ width: 300 }}
                        prefix={<SearchOutlined />}
                    />
                    <Select
                        placeholder="Loại giao dịch"
                        allowClear
                        style={{ width: 150 }}
                        onChange={handleTypeFilter}
                        options={[
                            { label: 'Nhập kho', value: 'IN' },
                            { label: 'Xuất kho', value: 'OUT' },
                            { label: 'Trả hàng', value: 'RETURNED' },
                        ]}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} giao dịch`,
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 1000 }}
                />
            </Card>
        </div>
    );
};
