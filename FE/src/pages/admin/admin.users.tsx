import { EditOutlined, StopOutlined, UserOutlined } from "@ant-design/icons"
import { Card, Space, Table, Tag, type TableProps } from "antd"
import { useEffect, useState } from "react";
import { type IUser } from '@/services/test/api'
import { getAllUsers } from "@/services/test/api";
import dayjs from "dayjs";
import { UpdateUserModal } from "@/components/admin/update-user.modal";

export const UsersPage = () => {
    const [dataTable, setDataTable] = useState<IUser[]>([]);
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);

    const onEditUser = (record: IUser) => {
        setIsOpenUpdateModal(true);
        setCurrentUser(record);
        console.log(record);
    }

    const columns: TableProps<IUser>['columns'] = [
        {
            title: 'STT',
            key: 'STT',
            render: (_, record, index) => <span>{index + 1}</span>
        },
        {
            title: 'Tên',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            render: (_, record) => {
                if (record.isActive) {
                    return <Tag color="success">Hoạt động</Tag>
                }
                return <Tag color="error">Khóa</Tag>
            },
            filters: [
                {
                    text: <Tag color="success">Hoạt động</Tag>,
                    value: true,
                },
                {
                    text: <Tag color="error">Khóa</Tag>,
                    value: false,
                }
            ],
            onFilter: (value, record) => record.isActive === value,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            render: (_, record) => {
                if (record.role === 'admin') {
                    return <Tag color="orange">admin</Tag>
                }
                else if (record.role === 'seller') {
                    return <Tag color="pink">seller</Tag>
                }
                return <Tag color="green">customer</Tag>
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            render: (_, record) => <span>{dayjs(record.createdAt).format('DD-MM-YYYY')}</span>
        },
        {
            title: 'Action',
            render: (_, record) => {
                return (
                    <Space>
                        <EditOutlined style={{ color: 'orange', padding: 10, cursor: 'pointer' }} onClick={() => onEditUser(record)} />
                        <StopOutlined style={{ color: 'red', padding: 10, cursor: 'pointer' }} />
                    </Space>
                )
            }
        }
    ];

    useEffect(() => {
        const loadUsers = async () => {
            const result = await getAllUsers();
            if (result.data) {
                setDataTable(result.data);
            }
        }
        loadUsers();
    }, [currentUser])

    return (
        <>
            <h1 className="text-4xl font-bold mb-10"> <UserOutlined /> Danh sách người dùng</h1>
            <Card hoverable className="shadow-md">
                <Table dataSource={dataTable} columns={columns} rowKey={'_id'} />
            </Card>

            <UpdateUserModal
                isOpen={isOpenUpdateModal}
                setIsOpen={setIsOpenUpdateModal}
                user={currentUser}
                setCurrentUser={setCurrentUser}
            />
        </>
    )
}