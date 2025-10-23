import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Card, Space, Table, Tag, type TableProps } from "antd";
import { Fragment, useState } from "react";

type Category = 'laptop' | 'phone' | 'desktop';
interface DataType {
    key: string;
    category: Category;
    name: string;
    quantity: number;
    sold: number;
}

export const ProductPage = () => {
    const [category, setCategory] = useState<Category[]>(['laptop', 'phone', 'desktop']);
    const filters = category.map((item) => ({ text: <Tag color="red">{item}</Tag>, value: item }))
    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Tến sản phẩm',
            dataIndex: 'name',
            key: 'name',
            sorter: {
                compare: (a, b) => (a.name.toLocaleLowerCase().localeCompare(b.name.toLowerCase()))
            },
        },
        {
            title: 'Loại',
            dataIndex: 'category',
            key: 'category',
            render: (_, record) => {
                if (record.category === 'desktop') {
                    return <Tag color="red" style={{ fontSize: 14 }}>{record.category}</Tag>
                }
                return <Tag color="yellow" style={{ fontSize: 14 }}>{record.category}</Tag>
            },
            filters: filters,
            onFilter: (value, record) => record.category.indexOf(value as string) === 0,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: {
                compare: (a, b) => (a.quantity - b.quantity)
            }
        },
        {
            title: 'Đã bán',
            dataIndex: 'sold',
            key: 'sold',
            sorter: {
                compare: (a, b) => (a.sold - b.sold)
            }
        },
        {
            title: 'Chỉnh sửa',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined style={{ color: 'orange', padding: 10 }} />
                    <DeleteOutlined style={{ color: 'red', padding: 10 }} />
                </Space>
            ),
        },
    ];

    const data: DataType[] = [
        {
            key: '1',
            name: 'John Brown',
            category: 'phone',
            quantity: 32,
            sold: 12,
        },
        {
            key: '2',
            name: 'Aoi Brown',
            category: 'desktop',
            quantity: 3,
            sold: 1,
        },
    ];
    return (
        <Fragment>
            <h1 className="text-4xl mb-10">Danh sách sản phẩm</h1>
            <Card hoverable className="shadow-md">
                <Table dataSource={data} columns={columns} />
            </Card>
        </Fragment>
    )
}