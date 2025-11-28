import { createProductFullAPI } from '@/services/admin/products/admin.product.api';
import { App, Form, Modal, Tabs, type FormProps, type UploadFile } from 'antd';
import { useState } from 'react';
import { AddProductTabItems } from './add.product.tabItem';
import { AddMetadataModal } from './add.metadata.modal';
import type { RcFile } from 'antd/es/upload';
import type { IAddProductFormValues, IBrand, IProductVariant } from '@/types/admin/product';

type MetadataModalType = 'category' | 'brand' | 'series' | null;

interface IProps {
    isModalOpen: boolean;
    setIsOpenModal: (v: boolean) => void;
    brand_options: IBrand[];
    category_options: { label: string; value: string }[];
    serie_options: { id: number; name: string; brand_id: number }[];
    onSuccess?: () => void;
    onRefreshOptions?: () => void; // Callback to refresh categories, brands, series
}

export const AddProductModal = (props: IProps) => {
    const {
        isModalOpen,
        setIsOpenModal,
        brand_options,
        category_options,
        serie_options,
        onSuccess,
        onRefreshOptions,
    } = props;
    const { message, notification } = App.useApp();
    const [loading, setLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('basic');
    const [mappingSeries, setMappingSeries] = useState<{ label: string; value: string }[]>([]);
    const [mappingBrands, setMappingBrands] = useState<{ label: string; value: string }[]>([]);
    const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]);
    const [sliderList, setSliderList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm<IAddProductFormValues>();

    // State for metadata modals
    const [metadataModalType, setMetadataModalType] = useState<MetadataModalType>(null);

    // Reset form when modal closes
    const handleClose = () => {
        form.resetFields();
        setThumbnailList([]);
        setSliderList([]);
        setMappingSeries([]);
        setMappingBrands([]);
        setActiveTab('basic');
        setIsOpenModal(false);
    };

    // Handlers for opening metadata modals
    const handleAddCategory = () => setMetadataModalType('category');
    const handleAddBrand = () => setMetadataModalType('brand');
    const handleAddSeries = () => setMetadataModalType('series');
    const handleCloseMetadataModal = () => setMetadataModalType(null);

    const handleMetadataSuccess = () => {
        // Refresh options list after adding new metadata
        onRefreshOptions?.();
    };

    // Calculate total quantity from variants
    const calculateTotalQuantity = (variants: IProductVariant[] = []) => {
        return variants.reduce((sum, v) => sum + (v?.quantity || 0), 0);
    };

    // Quá oke
    const onFinish: FormProps<IAddProductFormValues>['onFinish'] = async values => {
        // Validate images
        if (thumbnailList.length === 0) {
            message.error('Cần ít nhất 1 ảnh thumbnail');
            setActiveTab('images');
            return;
        }

        // Validate variants
        if (!values.variants || values.variants.length === 0) {
            message.error('Cần ít nhất 1 biến thể sản phẩm');
            setActiveTab('variants');
            return;
        }

        setLoading(true);
        try {
            // Collect all image files
            const allFiles: File[] = [];

            // Thumbnail first (will be marked as is_thumbnail in BE)
            thumbnailList.forEach(item => {
                if (item.originFileObj) {
                    allFiles.push(item.originFileObj as RcFile);
                }
            });

            // Then sliders
            sliderList.forEach(item => {
                if (item.originFileObj) {
                    allFiles.push(item.originFileObj as RcFile);
                }
            });

            // Prepare request data
            const requestData = {
                name: values.name,
                description: values.description,
                brand_id: Number(values.brand_id),
                series_id: Number(values.series_id),
                category_id: Number(values.category_id),
                is_active: values.is_active,
                variants: values.variants,
                specifications: values.specifications || [],
                images: allFiles,
            };

            // Call API
            const result = await createProductFullAPI(requestData);

            if (result.success) {
                notification.success({
                    message: 'Thành công',
                    description: `Sản phẩm "${values.name}" đã được tạo thành công!`,
                });
                handleClose();
                onSuccess?.();
            } else {
                notification.error({
                    message: 'Lỗi',
                    description: result.error || 'Không thể tạo sản phẩm',
                });
            }
        } catch (error: any) {
            console.error(error);
            notification.error({
                message: 'Lỗi',
                description: error?.response?.data?.error || 'Có lỗi xảy ra khi tạo sản phẩm',
            });
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed: FormProps<IAddProductFormValues>['onFinishFailed'] = errorInfo => {
        console.log('Failed:', errorInfo);
        // Find which tab has error and switch to it
        const errorFields = errorInfo.errorFields;
        if (errorFields.length > 0) {
            const firstErrorField = errorFields[0].name[0];
            if (
                firstErrorField === 'name' ||
                firstErrorField === 'description' ||
                firstErrorField === 'category_id' ||
                firstErrorField === 'brand_id' ||
                firstErrorField === 'series_id' ||
                firstErrorField === 'is_active'
            ) {
                setActiveTab('basic');
            } else if (firstErrorField === 'variants') {
                setActiveTab('variants');
            } else if (firstErrorField === 'specifications') {
                setActiveTab('specs');
            }
        }
        message.error('Vui lòng kiểm tra lại thông tin');
    };

    const onSubmit = () => {
        form.submit();
    };

    // Watch variants to show total quantity
    const variants = Form.useWatch('variants', form);
    const totalQuantity = calculateTotalQuantity(variants);

    return (
        <Modal
            title={<span className="text-xl font-semibold">Nhập hàng mới</span>}
            open={isModalOpen}
            onOk={onSubmit}
            onCancel={handleClose}
            width={900}
            okText="Tạo sản phẩm"
            cancelText="Hủy"
            okButtonProps={{
                loading: loading,
            }}
            destroyOnHidden
            maskClosable={false}
        >
            <Form<IAddProductFormValues>
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={{
                    is_active: false,
                    variants: [
                        {
                            color: '',
                            storage: '',
                            price: 0,
                            import_price: 0,
                            quantity: 0,
                        },
                    ],
                    specifications: [],
                }}
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={AddProductTabItems({
                        form,
                        variants,
                        totalQuantity,
                        thumbnailList,
                        sliderList,
                        setThumbnailList,
                        setSliderList,
                        mappingBrands,
                        mappingSeries,
                        setMappingBrands,
                        setMappingSeries,
                        brand_options,
                        category_options,
                        serie_options,
                        onAddCategory: handleAddCategory,
                        onAddBrand: handleAddBrand,
                        onAddSeries: handleAddSeries,
                    })}
                />
            </Form>

            {/* Metadata Modal for adding Category/Brand/Series */}
            <AddMetadataModal
                type={metadataModalType || 'category'}
                isOpen={metadataModalType !== null}
                onClose={handleCloseMetadataModal}
                onSuccess={handleMetadataSuccess}
                categories={category_options}
                brands={brand_options}
            />
        </Modal>
    );
};
