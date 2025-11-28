import { Modal, Form, Input, Select, App } from 'antd';
import { useState } from 'react';
import {
    createCategoryAPI,
    createBrandAPI,
    createSeriesAPI,
} from '@/services/admin/products/admin.product.api';
import type { IBrand } from '@/types/admin/product';

type MetadataType = 'category' | 'brand' | 'series';

interface AddMetadataModalProps {
    type: MetadataType;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    // For brand: need categories
    categories?: { value: string; label: string }[];
    // For series: need brands
    brands?: IBrand[];
}

const modalTitles: Record<MetadataType, string> = {
    category: 'Thêm danh mục mới',
    brand: 'Thêm thương hiệu mới',
    series: 'Thêm dòng sản phẩm mới',
};

export const AddMetadataModal = ({
    type,
    isOpen,
    onClose,
    onSuccess,
    categories = [],
    brands = [],
}: AddMetadataModalProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            let result;
            switch (type) {
                case 'category':
                    result = await createCategoryAPI({
                        name: values.name,
                        parent_id: values.parent_id ? parseInt(values.parent_id) : undefined,
                    });
                    break;
                case 'brand':
                    result = await createBrandAPI({
                        name: values.name,
                        description: values.description || '',
                        category_id: parseInt(values.category_id),
                    });
                    break;
                case 'series':
                    result = await createSeriesAPI({
                        name: values.name,
                        brand_id: parseInt(values.brand_id),
                    });
                    break;
            }

            if (result?.success) {
                message.success(`Đã thêm ${modalTitles[type].toLowerCase()} thành công!`);
                form.resetFields();
                onSuccess();
                onClose();
            }
        } catch (error: any) {
            const errorMsg = error?.response?.data?.error || error?.message || 'Có lỗi xảy ra';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    const renderFormFields = () => {
        switch (type) {
            case 'category':
                return (
                    <>
                        <Form.Item
                            name="name"
                            label="Tên danh mục"
                            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
                        >
                            <Input placeholder="VD: Laptop, Điện thoại, Tablet..." />
                        </Form.Item>
                        <Form.Item name="parent_id" label="Danh mục cha (tùy chọn)">
                            <Select
                                placeholder="Chọn danh mục cha"
                                allowClear
                                options={categories}
                            />
                        </Form.Item>
                    </>
                );

            case 'brand':
                return (
                    <>
                        <Form.Item
                            name="name"
                            label="Tên thương hiệu"
                            rules={[{ required: true, message: 'Vui lòng nhập tên thương hiệu' }]}
                        >
                            <Input placeholder="VD: Apple, Samsung, Dell..." />
                        </Form.Item>
                        <Form.Item
                            name="category_id"
                            label="Danh mục"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                        >
                            <Select placeholder="Chọn danh mục" options={categories} />
                        </Form.Item>
                        <Form.Item name="description" label="Mô tả">
                            <Input.TextArea rows={3} placeholder="Mô tả về thương hiệu..." />
                        </Form.Item>
                    </>
                );

            case 'series':
                return (
                    <>
                        <Form.Item
                            name="name"
                            label="Tên dòng sản phẩm"
                            rules={[{ required: true, message: 'Vui lòng nhập tên dòng sản phẩm' }]}
                        >
                            <Input placeholder="VD: iPhone 15, Galaxy S24, XPS..." />
                        </Form.Item>
                        <Form.Item
                            name="brand_id"
                            label="Thương hiệu"
                            rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}
                        >
                            <Select
                                placeholder="Chọn thương hiệu"
                                options={brands.map(b => ({
                                    value: b.id.toString(),
                                    label: b.name,
                                }))}
                            />
                        </Form.Item>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <Modal
            title={modalTitles[type]}
            open={isOpen}
            onOk={handleSubmit}
            onCancel={handleCancel}
            confirmLoading={loading}
            okText="Thêm mới"
            cancelText="Hủy"
            destroyOnHidden
        >
            <Form form={form} layout="vertical" className="mt-4">
                {renderFormFields()}
            </Form>
        </Modal>
    );
};
