import { EditOutlined, StopOutlined, UserOutlined, SearchOutlined, ReloadOutlined, TeamOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons"
import { Card, Space, Table, Tag, type TableProps, Row, Col, Statistic, Input, Button, Tooltip, Avatar, Empty } from "antd"
import { useEffect, useState, useCallback } from "react";
import { type IUser } from '@/services/test/api'
import { getAllUsers } from "@/services/test/api";
import dayjs from "dayjs";
import { UpdateUserModal } from "@/components/admin/update-user.modal";

const USER_STATUS = {
    ACTIVE: { color: 'success', text: 'Hoạt động' },
    INACTIVE: { color: 'error', text: 'Khóa' }
} as const;

const USER_ROLES = {
    ADMIN: { color: 'orange', text: 'admin' },
    SELLER: { color: 'pink', text: 'seller' },
    CUSTOMER: { color: 'green', text: 'customer' }
} as const;

const useUsersPage = () => {
    const [dataTable, setDataTable] = useState<IUser[]>([]);
    const [filteredData, setFilteredData] = useState<IUser[]>([]);
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');

    const handleEditUser = useCallback((record: IUser) => {
        setCurrentUser(record);
        setIsOpenUpdateModal(true);
    }, []);

    const refreshUsers = useCallback(async () => {
        try {
            const result = await getAllUsers();
            if (result.data) {
                setDataTable(result.data);
                setFilteredData(result.data);
            }
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    }, []);

    const handleSearch = useCallback((value: string) => {
        setSearchText(value);
        const filtered = dataTable.filter(user =>
            user.fullName.toLowerCase().includes(value.toLowerCase()) ||
            user.email.toLowerCase().includes(value.toLowerCase()) ||
            user.role.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    }, [dataTable]);

    const getStatistics = useCallback(() => {
        const totalUsers = dataTable.length;
        const activeUsers = dataTable.filter(user => user.isActive).length;
        const adminUsers = dataTable.filter(user => user.role === 'admin').length;
        const customerUsers = dataTable.filter(user => user.role === 'customer').length;
        const sellerUsers = dataTable.filter(user => user.role === 'seller').length;

        return { totalUsers, activeUsers, adminUsers, customerUsers, sellerUsers };
    }, [dataTable]);

    useEffect(() => {
        refreshUsers();
    }, [refreshUsers]);

    return {
        dataTable,
        filteredData,
        currentUser,
        isOpenUpdateModal,
        searchText,
        handleEditUser,
        setCurrentUser,
        setIsOpenUpdateModal,
        handleSearch,
        refreshUsers,
        getStatistics
    };
};

const createTableColumns = (onEdit: (record: IUser) => void): TableProps<IUser>['columns'] => [
    {
        title: 'STT',
        key: 'STT',
        width: 60,
        align: 'center',
        render: (_, __, index) => <span className="font-medium">{index + 1}</span>,
    },
    {
        title: 'Thông tin người dùng',
        dataIndex: 'fullName',
        sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        render: (_, record) => (
            <div className="flex items-center gap-3">
                <Avatar size={40} icon={<UserOutlined />} className="bg-blue-500" />
                <div>
                    <div className="font-semibold text-gray-900">{record.fullName}</div>
                    <div className="text-sm text-gray-500">{record.email}</div>
                </div>
            </div>
        ),
    },
    {
        title: 'Trạng thái',
        dataIndex: 'isActive',
        width: 120,
        align: 'center',
        render: (_, record) => {
            const status = record.isActive ? USER_STATUS.ACTIVE : USER_STATUS.INACTIVE;
            return (
                <Tag
                    color={status.color}
                    icon={record.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    className="font-medium"
                >
                    {status.text}
                </Tag>
            );
        },
        filters: [
            {
                text: <Tag color={USER_STATUS.ACTIVE.color}>{USER_STATUS.ACTIVE.text}</Tag>,
                value: true,
            },
            {
                text: <Tag color={USER_STATUS.INACTIVE.color}>{USER_STATUS.INACTIVE.text}</Tag>,
                value: false,
            }
        ],
        onFilter: (value, record) => record.isActive === value,
    },
    {
        title: 'Vai trò',
        dataIndex: 'role',
        width: 100,
        align: 'center',
        render: (_, record) => {
            const roleConfig = USER_ROLES[record.role.toUpperCase() as keyof typeof USER_ROLES] || USER_ROLES.CUSTOMER;
            return (
                <Tag color={roleConfig.color} className="font-medium">
                    {roleConfig.text}
                </Tag>
            );
        },
        filters: Object.values(USER_ROLES).map(role => ({
            text: <Tag color={role.color}>{role.text}</Tag>,
            value: role.text,
        })),
        onFilter: (value, record) => record.role === value,
    },
    {
        title: 'Ngày tham gia',
        dataIndex: 'createdAt',
        width: 120,
        align: 'center',
        render: (_, record) => (
            <div className="text-sm">
                <div className="font-medium">{dayjs(record.createdAt).format('DD-MM-YYYY')}</div>
                <div className="text-gray-500">{dayjs(record.createdAt).format('HH:mm')}</div>
            </div>
        ),
        sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
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
            </Space>
        ),
    }
];

export const UsersPage = () => {
    const {
        filteredData,
        currentUser,
        isOpenUpdateModal,
        searchText,
        handleEditUser,
        setCurrentUser,
        setIsOpenUpdateModal,
        handleSearch,
        refreshUsers,
        getStatistics
    } = useUsersPage();

    const { totalUsers, activeUsers, sellerUsers, customerUsers } = getStatistics();
    const columns = createTableColumns(handleEditUser);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <TeamOutlined className="text-2xl text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
                            <p className="text-gray-600 mt-1">Quản lý thông tin và trạng thái tài khoản người dùng</p>
                        </div>
                    </div>
                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={refreshUsers}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        Tải lại
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center shadow-sm border-0">
                        <Statistic
                            title={<span className="text-gray-600 font-medium">Tổng người dùng</span>}
                            value={totalUsers}
                            prefix={<TeamOutlined className="text-blue-500" />}
                            valueStyle={{ color: '#3B82F6', fontSize: '2rem', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center shadow-sm border-0">
                        <Statistic
                            title={<span className="text-gray-600 font-medium">Đang hoạt động</span>}
                            value={activeUsers}
                            prefix={<CheckCircleOutlined className="text-green-500" />}
                            valueStyle={{ color: '#10B981', fontSize: '2rem', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center shadow-sm border-0">
                        <Statistic
                            title={<span className="text-gray-600 font-medium">Nhân viên</span>}
                            value={sellerUsers}
                            prefix={<UserOutlined className="text-orange-500" />}
                            valueStyle={{ color: '#F97316', fontSize: '2rem', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center shadow-sm border-0">
                        <Statistic
                            title={<span className="text-gray-600 font-medium">Khách hàng</span>}
                            value={customerUsers}
                            prefix={<UserOutlined className="text-green-500" />}
                            valueStyle={{ color: '#10B981', fontSize: '2rem', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Main Content Card */}
            <Card
                className="shadow-lg border-0"
                title={
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-semibold text-gray-900">
                            <UserOutlined className="mr-2" />
                            Danh sách người dùng
                        </span>
                        <div className="flex items-center gap-4">
                            <Input.Search
                                placeholder="Tìm kiếm theo tên, email, vai trò..."
                                allowClear
                                enterButton={<SearchOutlined />}
                                size="large"
                                style={{ width: 300 }}
                                value={searchText}
                                onChange={(e) => handleSearch(e.target.value)}
                                onSearch={handleSearch}
                            />
                        </div>
                    </div>
                }
            >
                <Table
                    dataSource={filteredData}
                    columns={columns}
                    rowKey="_id"
                    size="middle"
                    className="custom-table"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => (
                            <span className="text-gray-600">
                                Hiển thị {range[0]}-{range[1]} của {total} người dùng
                            </span>
                        ),
                        pageSizeOptions: ['10', '20', '50', '100']
                    }}
                    scroll={{ x: 1000 }}
                    locale={
                        {
                            emptyText: (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                        <span>
                                            Không tìm thấy kết quả nào.
                                        </span>
                                    }
                                />
                            ),
                        }
                    }
                />
            </Card>

            <UpdateUserModal
                isOpen={isOpenUpdateModal}
                setIsOpen={setIsOpenUpdateModal}
                user={currentUser}
                setCurrentUser={setCurrentUser}
                refreshUsers={refreshUsers}
            />
        </div>
    );
};