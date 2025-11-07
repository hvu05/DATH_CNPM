import { HistoryOutlined } from '@ant-design/icons';
import { Card, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface IInventoryHistory {
    ID: number;
    name: string;
    quantity: number;
    importTime: string;
    price: number;
}

const inventoryData: IInventoryHistory[] = [
    {
        ID: 1,
        name: 'MSI Thin U63',
        quantity: 120,
        price: 12_000_000,
        importTime: '2024-10-01T09:15:00Z',
    },
    {
        ID: 2,
        name: 'Macbook pro M1',
        quantity: 102,
        price: 9_000_000,
        importTime: '2024-10-01T09:15:00Z',
    },
    { ID: 3, name: 'Oppo', quantity: 121, price: 32_000_000, importTime: '2024-10-01T09:15:00Z' },
    { ID: 4, name: 'Xiaomi', quantity: 121, price: 33_000_000, importTime: '2024-10-01T09:15:00Z' },
    {
        ID: 5,
        name: 'MSI Thin U63',
        quantity: 122,
        price: 12_000_000,
        importTime: '2024-10-01T09:13:00Z',
    },
    {
        ID: 6,
        name: 'Iphone 19',
        quantity: 123,
        price: 12_000_000,
        importTime: '2024-10-01T09:14:00Z',
    },
    {
        ID: 7,
        name: 'MSI Thin U63',
        quantity: 112,
        price: 80_000_000,
        importTime: '2024-10-01T09:15:00Z',
    },
];

const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
});

export const InventoryHistoryPage = () => {
    const columns: ColumnsType<IInventoryHistory> = [
        {
            title: 'ID',
            dataIndex: 'ID',
            sorter: (a, b) => a.ID - b.ID,
            sortDirections: ['ascend', 'descend'],
            width: 100,
        },
        {
            title: 'name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Price',
            dataIndex: 'price',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
        },
        {
            title: 'Import time',
            dataIndex: 'importTime',
            sorter: (a, b) => new Date(a.importTime).getTime() - new Date(b.importTime).getTime(),
            sortDirections: ['ascend', 'descend'],
            render: (_, record) => <span>{timeFormatter.format(new Date(record.importTime))}</span>,
        },
    ];

    // const { Text, Title } = Typography;
    return (
        <>
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <HistoryOutlined className="text-2xl text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Lịch sử nhập hàng
                                </h1>
                                <p className="text-gray-600 mt-1">Quản lí lịch sử nhập hàng</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Card>
                    <Table columns={columns} dataSource={inventoryData} />
                </Card>
            </div>
        </>
    );
};
