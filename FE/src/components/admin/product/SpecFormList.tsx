import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Col, Form, Input, Row, Typography } from 'antd';

const { Text } = Typography;

// Common specification names for autocomplete suggestions
const SPEC_SUGGESTIONS = [
    { value: 'CPU' },
    { value: 'RAM' },
    { value: 'Bộ nhớ trong' },
    { value: 'Màn hình' },
    { value: 'Pin' },
    { value: 'Camera sau' },
    { value: 'Camera trước' },
    { value: 'Hệ điều hành' },
    { value: 'Chip đồ họa' },
    { value: 'Kết nối' },
    { value: 'Cổng sạc' },
    { value: 'Trọng lượng' },
    { value: 'Kích thước' },
    { value: 'Chất liệu' },
    { value: 'Màu sắc' },
    { value: 'Bảo hành' },
];

export const SpecFormList = () => {
    return (
        <Form.List name="specifications">
            {(fields, { add, remove }) => (
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <Text strong className="text-lg">
                                Thông số kỹ thuật ({fields.length})
                            </Text>
                            <Text type="secondary" className="block text-sm">
                                Tùy chọn - Thêm các thông số kỹ thuật chi tiết của sản phẩm
                            </Text>
                        </div>
                        <Button
                            type="dashed"
                            onClick={() => add({ name: '', value: '' })}
                            icon={<PlusOutlined />}
                        >
                            Thêm thông số
                        </Button>
                    </div>

                    {/* Spec Items */}
                    {fields.map(({ key, name, ...restField }) => (
                        <div key={key} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <Row gutter={16} align="middle">
                                <Col xs={24} sm={10}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'name']}
                                        label="Tên thông số"
                                        rules={[{ required: true, message: 'Nhập tên thông số' }]}
                                        className="mb-0"
                                    >
                                        <AutoComplete
                                            options={SPEC_SUGGESTIONS}
                                            placeholder="VD: RAM, CPU, Pin..."
                                            filterOption={(inputValue, option) =>
                                                option?.value
                                                    .toLowerCase()
                                                    .indexOf(inputValue.toLowerCase()) !== -1
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={10}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'value']}
                                        label="Giá trị"
                                        rules={[{ required: true, message: 'Nhập giá trị' }]}
                                        className="mb-0"
                                    >
                                        <Input placeholder="VD: 8GB, Intel i7, 5000mAh..." />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={4} className="flex justify-end">
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => remove(name)}
                                    >
                                        Xóa
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    ))}

                    {/* Empty State */}
                    {fields.length === 0 && (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <Text type="secondary">
                                Chưa có thông số nào. Nhấn "Thêm thông số" để bắt đầu.
                            </Text>
                            <div className="mt-2">
                                <Text type="secondary" className="text-xs">
                                    Gợi ý: RAM, CPU, Pin, Màn hình, Camera...
                                </Text>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Form.List>
    );
};
