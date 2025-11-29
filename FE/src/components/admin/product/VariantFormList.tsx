import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row, Typography } from 'antd';

const { Text } = Typography;

interface IProps {
    // Optional: callback when total quantity changes
    onQuantityChange?: (total: number) => void;
}

export const VariantFormList = ({ onQuantityChange }: IProps) => {
    return (
        <Form.List
            name="variants"
            rules={[
                {
                    validator: async (_, variants) => {
                        if (!variants || variants.length < 1) {
                            return Promise.reject(new Error('Cần ít nhất 1 phiên bản sản phẩm'));
                        }
                    },
                },
            ]}
        >
            {(fields, { add, remove }, { errors }) => (
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <Text strong className="text-lg">
                            Danh sách phiên bản({fields.length})
                        </Text>
                        <Button
                            type="dashed"
                            onClick={() =>
                                add({
                                    color: '',
                                    storage: '',
                                    price: 0,
                                    import_price: 0,
                                    quantity: 0,
                                })
                            }
                            icon={<PlusOutlined />}
                        >
                            Thêm phiên bản
                        </Button>
                    </div>

                    {/* Variant Items */}
                    {fields.map(({ key, name, ...restField }) => (
                        <div
                            key={key}
                            className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative"
                        >
                            <Row gutter={[16, 8]}>
                                <Col xs={24} sm={12} md={6}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'color']}
                                        label="Màu sắc"
                                        rules={[{ required: true, message: 'Nhập màu sắc' }]}
                                    >
                                        <Input placeholder="VD: Đen, Trắng, Xanh..." />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'storage']}
                                        label="Dung lượng"
                                        rules={[{ required: true, message: 'Nhập dung lượng' }]}
                                    >
                                        <Input placeholder="VD: 128GB, 256GB, 512GB..." />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={4}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'quantity']}
                                        label="Số lượng"
                                        rules={[
                                            { required: true, message: 'Nhập số lượng' },
                                            {
                                                type: 'number',
                                                min: 0,
                                                message: 'Số lượng >= 0',
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            min={0}
                                            className="w-full"
                                            placeholder="0"
                                            onChange={() => {
                                                // Trigger quantity change callback if needed
                                                if (onQuantityChange) {
                                                    // Will be calculated in parent
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={4}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'import_price']}
                                        label="Giá nhập"
                                        rules={[
                                            { required: true, message: 'Nhập giá nhập' },
                                            {
                                                type: 'number',
                                                min: 0,
                                                message: 'Giá >= 0',
                                            },
                                        ]}
                                    >
                                        <InputNumber<number>
                                            min={0}
                                            className="w-full"
                                            placeholder="0"
                                            formatter={value =>
                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                            }
                                            parser={value =>
                                                value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={4}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'price']}
                                        label="Giá bán"
                                        rules={[
                                            { required: true, message: 'Nhập giá bán' },
                                            {
                                                type: 'number',
                                                min: 0,
                                                message: 'Giá >= 0',
                                            },
                                        ]}
                                    >
                                        <InputNumber<number>
                                            min={0}
                                            className="w-full"
                                            placeholder="0"
                                            formatter={value =>
                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                            }
                                            parser={value =>
                                                value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* Delete Button */}
                            {fields.length > 1 && (
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => remove(name)}
                                    className="absolute top-2 right-2"
                                    size="small"
                                >
                                    Xóa
                                </Button>
                            )}
                        </div>
                    ))}

                    {/* Empty State */}
                    {fields.length === 0 && (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <Text type="secondary">Chưa có phiên bản nào !!!</Text>
                        </div>
                    )}

                    {/* Validation Errors */}
                    <Form.ErrorList errors={errors} />
                </div>
            )}
        </Form.List>
    );
};
