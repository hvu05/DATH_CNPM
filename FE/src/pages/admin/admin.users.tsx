import {
    EditOutlined,
    UserOutlined,
    SearchOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ReloadOutlined,
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
    type TablePaginationConfig,
} from 'antd';
import { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import { UpdateUserModal } from '@/components/admin/modal/update-user.modal';
import {
    getAllUsersAPI,
    getUserRoles,
    getUserStaticsAPI,
    type IGetUsersParams,
    type IUserStatics,
} from '@/services/user/api';
import type { FilterValue, TableCurrentDataSource } from 'antd/es/table/interface';

const USER_STATUS = {
    ACTIVE: { color: 'success', text: 'Hoạt động' },
    INACTIVE: { color: 'error', text: 'Khóa' },
} as const;

const USER_ROLES = {
    ADMIN: { color: 'orange', text: 'ADMIN' },
    STAFF: { color: 'pink', text: 'STAFF' },
    CUSTOMER: { color: 'green', text: 'CUSTOMER' },
} as const;

const useUsersPage = () => {
    const [dataTable, setDataTable] = useState<IUser[]>([]);
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<{ id: number; name: string }[]>([]);
    const [filters, setFilters] = useState<IGetUsersParams>({
        page: 1,
        limit: 10,
        sortBy: 'create_at',
        sortOrder: 'desc',
    });
    const [meta, setMeta] = useState<{ total: number; page: number; limit: number } | null>(null);
    const [statistics, setStatistics] = useState<IUserStatics>({
        totalUsers: 0,
        activeUsers: 0,
        customerUsers: 0,
        staffUsers: 0,
    });

    const handleEditUser = (record: IUser) => {
        setCurrentUser(record);
        setIsOpenUpdateModal(true);
    };

    const loadUserRole = async () => {
        try {
            const result = await getUserRoles();
            if (result.data) {
                setUserRole(result.data);
            }
        } catch (error) {
            console.error('Failed to get user roles', error);
        }
    };

    const loadUsers = useCallback(
        async (params?: IGetUsersParams) => {
            try {
                const queryParams = params || filters;
                const result = await getAllUsersAPI(queryParams);
                if (result.data) {
                    setDataTable(result.data.results);
                    setMeta({
                        total: result.data.total,
                        page: result.data.page,
                        limit: result.data.limit,
                    });
                }
            } catch (error) {
                console.error('Failed to load users:', error);
            }
        },
        [filters]
    );

    const getUsersStatic = useCallback(async () => {
        try {
            const result = await getUserStaticsAPI();
            if (result.data) {
                setStatistics({
                    totalUsers: result.data.totalUsers,
                    activeUsers: result.data.activeUsers,
                    customerUsers: result.data.customerUsers,
                    staffUsers: result.data.staffUsers,
                });
            }
        } catch (error: any) {
            console.error('Failed to load user statistics:', error);
        }
    }, []);

    const refreshUsers = useCallback(async () => {
        await loadUsers();
        await getUsersStatic();
    }, [loadUsers, getUsersStatic]);

    const handleSearch = useCallback(
        (value: string) => {
            const newFilters = { ...filters, search: value || undefined, page: 1 };
            setFilters(newFilters);
            loadUsers(newFilters);
        },
        [filters, loadUsers]
    );

    const handleTableChange = useCallback(
        async (
            pagination: TablePaginationConfig,
            tableFilters: Record<string, FilterValue | null>,
            sorter: any,
            extra: TableCurrentDataSource<IUser>
        ) => {
            const { current, pageSize } = pagination;
            const newFilters: IGetUsersParams = {
                role: tableFilters.role as string[] | null,
                isActive: tableFilters.is_active as boolean[] | null,
                page: current,
                limit: pageSize,
            };

            if (sorter.field && sorter.order) {
                newFilters.sortBy = sorter.field;
                newFilters.sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
            }
            setFilters(newFilters);
            await loadUsers(newFilters);
        },
        [loadUsers]
    );

    useEffect(() => {
        loadUsers();
        getUsersStatic();
        loadUserRole();
    }, []);

    return {
        dataTable,
        currentUser,
        isOpenUpdateModal,
        filters,
        setFilters,
        handleEditUser,
        setCurrentUser,
        setIsOpenUpdateModal,
        handleSearch,
        refreshUsers,
        statistics,
        meta,
        handleTableChange,
        userRole,
    };
};

export const UsersPage = () => {
    const {
        dataTable,
        currentUser,
        isOpenUpdateModal,
        filters,
        setFilters,
        handleEditUser,
        setCurrentUser,
        setIsOpenUpdateModal,
        handleSearch,
        refreshUsers,
        statistics,
        meta,
        handleTableChange,
        userRole,
    } = useUsersPage();

    const createTableColumns = (onEdit: (record: IUser) => void): TableProps<IUser>['columns'] => [
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
            title: 'Thông tin người dùng',
            dataIndex: 'full_name',
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        size={40}
                        icon={<UserOutlined />}
                        className="bg-blue-500"
                        src={`${import.meta.env.VITE_CLOUDINARY_NAME}/${record.avatar}`}
                    />
                    <div>
                        <div className="font-semibold text-gray-900">{record.full_name}</div>
                        <div className="text-sm text-gray-500">{record.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'is_active',
            width: 120,
            align: 'center',
            render: (_, record) => {
                const status = record.is_active ? USER_STATUS.ACTIVE : USER_STATUS.INACTIVE;
                return (
                    <Tag
                        color={status.color}
                        icon={record.is_active ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
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
                },
            ],
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            width: 100,
            align: 'center',
            render: (_, record) => {
                const roleConfig =
                    USER_ROLES[record.role.toUpperCase() as keyof typeof USER_ROLES] ||
                    USER_ROLES.CUSTOMER;
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
            dataIndex: 'create_at',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <div className="text-sm">
                    <div className="font-medium">
                        {dayjs(record.create_at).format('DD-MM-YYYY')}
                    </div>
                    <div className="text-gray-500">{dayjs(record.create_at).format('HH:mm')}</div>
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
                </Space>
            ),
        },
    ];

    const { totalUsers, activeUsers, staffUsers, customerUsers } = statistics;
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
                            <p className="text-gray-600 mt-1">
                                Quản lý thông tin và trạng thái tài khoản người dùng
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center shadow-sm border-0">
                        <Statistic
                            title={
                                <span className="text-gray-600 font-medium">Tổng người dùng</span>
                            }
                            value={totalUsers}
                            prefix={<TeamOutlined className="text-blue-500" />}
                            valueStyle={{ color: '#3B82F6', fontSize: '2rem', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="text-center shadow-sm border-0">
                        <Statistic
                            title={
                                <span className="text-gray-600 font-medium">Đang hoạt động</span>
                            }
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
                            value={staffUsers}
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
                        <div className="flex gap-2 items-center">
                            <div className="flex items-center gap-4">
                                <Input.Search
                                    placeholder="Tìm kiếm theo tên, email"
                                    allowClear
                                    enterButton={<SearchOutlined />}
                                    size="large"
                                    style={{ width: 300 }}
                                    value={filters.search || ''}
                                    onChange={e => handleSearch(e.target.value)}
                                    onSearch={handleSearch}
                                />
                            </div>
                            <ReloadOutlined
                                className="p-4 hover:cursor-pointer hover:text-red-600"
                                onClick={() => window.location.reload()}
                            />
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
                                Hiển thị {range[0]}-{range[1]} của {meta?.total ?? 0} người dùng
                            </span>
                        ),
                        pageSizeOptions: ['5', '10', '20', '50', '100'],
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 1000 }}
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={<span>Không tìm thấy kết quả nào.</span>}
                            />
                        ),
                    }}
                />
            </Card>

            <UpdateUserModal
                isOpen={isOpenUpdateModal}
                setIsOpen={setIsOpenUpdateModal}
                user={currentUser}
                setCurrentUser={setCurrentUser}
                refreshUsers={refreshUsers}
                roles={userRole.map(value => {
                    return {
                        label: value.name,
                        value: value.id,
                    };
                })}
            />
        </div>
    );
};
