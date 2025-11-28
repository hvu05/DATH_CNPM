import {
    getProductDetailAPI,
    updateProductFullAPI,
} from '@/services/admin/products/admin.product.api';
import {
    App,
    Form,
    Modal,
    Tabs,
    Spin,
    type FormProps,
    type UploadFile,
    Image,
    Row,
    Col,
    Typography,
    Input,
    Select,
    Button,
    Space,
} from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { AddMetadataModal } from './add.metadata.modal';
import type { RcFile } from 'antd/es/upload';
import type { IAddProductFormValues, IBrand, IProductImage } from '@/types/admin/product';
import {
    DeleteOutlined,
    StarFilled,
    StarOutlined,
    InfoCircleOutlined,
    AppstoreOutlined,
    PictureOutlined,
    SettingOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { VariantFormList, SpecFormList } from '@/components/admin/product';
import { UploadImage } from '@/components/admin/upload.img';
import FormItem from 'antd/es/form/FormItem';

const { Text } = Typography;
const { TextArea } = Input;
const MAX_THUMBNAILS = 1;
const MAX_SLIDERS = 5;

type MetadataModalType = 'category' | 'brand' | 'series' | null;

interface IProps {
    isModalOpen: boolean;
    setIsOpenModal: (v: boolean) => void;
    productId: number | string | null;
    brand_options: IBrand[];
    category_options: { label: string; value: string }[];
    serie_options: { id: number; name: string; brand_id: number }[];
    onSuccess?: () => void;
    onRefreshOptions?: () => void;
}

export const EditProductModal = (props: IProps) => {
    const {
        isModalOpen,
        setIsOpenModal,
        productId,
        brand_options,
        category_options,
        serie_options,
        onSuccess,
        onRefreshOptions,
    } = props;
    const { message, notification } = App.useApp();
    const [loading, setLoading] = useState<boolean>(false);
    const [fetchLoading, setFetchLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('basic');
    const [mappingSeries, setMappingSeries] = useState<{ label: string; value: string }[]>([]);
    const [mappingBrands, setMappingBrands] = useState<{ label: string; value: string }[]>([]);
    const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]);
    const [sliderList, setSliderList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm<IAddProductFormValues>();

    // Existing images from server
    const [existingImages, setExistingImages] = useState<IProductImage[]>([]);
    const [keepImageIds, setKeepImageIds] = useState<number[]>([]);
    const [thumbnailImageId, setThumbnailImageId] = useState<number | null>(null);

    // State for metadata modals
    const [metadataModalType, setMetadataModalType] = useState<MetadataModalType>(null);

    // Fetch product detail when modal opens
    const fetchProductDetail = useCallback(async () => {
        if (!productId) return;

        setFetchLoading(true);
        try {
            const result = await getProductDetailAPI(productId);
            if (result.success && result.data) {
                const product = result.data;

                // Set existing images
                setExistingImages(product.product_image || []);
                const imageIds = product.product_image?.map(img => img.id) || [];
                setKeepImageIds(imageIds);

                // Find thumbnail
                const thumbnail = product.product_image?.find(img => img.is_thumbnail);
                setThumbnailImageId(thumbnail?.id || null);

                // Setup mapping brands based on category
                const brandMappings = brand_options
                    .filter(b => b.category_id === product.category_id)
                    .map(b => ({ label: b.name, value: b.id.toString() }));
                setMappingBrands(brandMappings);

                // Setup mapping series based on brand
                const seriesMappings = serie_options
                    .filter(s => s.brand_id === product.brand_id)
                    .map(s => ({ label: s.name, value: s.id.toString() }));
                setMappingSeries(seriesMappings);

                // Populate form
                form.setFieldsValue({
                    name: product.name,
                    description: product.description,
                    category_id: product.category_id,
                    brand_id: product.brand_id,
                    series_id: product.series_id,
                    is_active: product.is_active,
                    variants:
                        product.product_variants?.map(v => ({
                            color: v.color || '',
                            storage: v.storage || '',
                            price: v.price,
                            import_price: v.import_price,
                            quantity: v.quantity,
                        })) || [],
                    specifications:
                        product.product_specs?.map(s => ({
                            name: s.spec_name,
                            value: s.spec_value,
                        })) || [],
                });
            }
        } catch (error: any) {
            console.error('Failed to fetch product:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể tải thông tin sản phẩm',
            });
        } finally {
            setFetchLoading(false);
        }
    }, [productId, brand_options, serie_options, form, notification]);

    useEffect(() => {
        if (isModalOpen && productId) {
            fetchProductDetail();
        }
    }, [isModalOpen, productId, fetchProductDetail]);

    // Reset form when modal closes
    const handleClose = () => {
        form.resetFields();
        setThumbnailList([]);
        setSliderList([]);
        setMappingSeries([]);
        setMappingBrands([]);
        setActiveTab('basic');
        setExistingImages([]);
        setKeepImageIds([]);
        setThumbnailImageId(null);
        setIsOpenModal(false);
    };

    // Handlers for opening metadata modals
    const handleAddCategory = () => setMetadataModalType('category');
    const handleAddBrand = () => setMetadataModalType('brand');
    const handleAddSeries = () => setMetadataModalType('series');
    const handleCloseMetadataModal = () => setMetadataModalType(null);

    const handleMetadataSuccess = () => {
        onRefreshOptions?.();
    };

    // Handle removing existing image
    const handleRemoveExistingImage = (imageId: number) => {
        setKeepImageIds(prev => prev.filter(id => id !== imageId));
        if (thumbnailImageId === imageId) {
            setThumbnailImageId(null);
        }
    };

    // Handle setting thumbnail for existing image
    const handleSetThumbnail = (imageId: number) => {
        setThumbnailImageId(imageId);
    };

    // Calculate total quantity from variants
    const calculateTotalQuantity = (variants: any[] = []) => {
        return variants.reduce((sum, v) => sum + (v?.quantity || 0), 0);
    };

    const onFinish: FormProps<IAddProductFormValues>['onFinish'] = async values => {
        // Validate: at least one image (existing or new)
        const hasExistingImages = keepImageIds.length > 0;
        const hasNewImages = thumbnailList.length > 0 || sliderList.length > 0;

        if (!hasExistingImages && !hasNewImages) {
            message.error('Cần ít nhất 1 ảnh sản phẩm');
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
            // Collect new image files
            const newFiles: File[] = [];

            thumbnailList.forEach(item => {
                if (item.originFileObj) {
                    newFiles.push(item.originFileObj as RcFile);
                }
            });

            sliderList.forEach(item => {
                if (item.originFileObj) {
                    newFiles.push(item.originFileObj as RcFile);
                }
            });

            // Prepare update request
            const updateData = {
                name: values.name,
                description: values.description,
                brand_id: Number(values.brand_id),
                series_id: Number(values.series_id),
                category_id: Number(values.category_id),
                is_active: values.is_active,
                keepImageIds: keepImageIds,
                thumbnailImageId: thumbnailImageId || undefined,
                variants: values.variants,
                specifications: values.specifications || [],
                images: newFiles.length > 0 ? newFiles : undefined,
            };

            const result = await updateProductFullAPI(productId!, updateData);

            if (result.success) {
                notification.success({
                    message: 'Thành công',
                    description: `Sản phẩm "${values.name}" đã được cập nhật!`,
                });
                handleClose();
                onSuccess?.();
            } else {
                notification.error({
                    message: 'Lỗi',
                    description: result.error || 'Không thể cập nhật sản phẩm',
                });
            }
        } catch (error: any) {
            console.error(error);
            notification.error({
                message: 'Lỗi',
                description: error?.response?.data?.error || 'Có lỗi xảy ra khi cập nhật sản phẩm',
            });
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed: FormProps<IAddProductFormValues>['onFinishFailed'] = errorInfo => {
        console.log('Failed:', errorInfo);
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

    // Render existing images section
    const renderExistingImages = () => {
        const keptImages = existingImages.filter(img => keepImageIds.includes(img.id));

        if (keptImages.length === 0) return null;

        return (
            <div className="mb-4">
                <div className="text-sm font-medium mb-2">Ảnh hiện tại:</div>
                <div className="flex flex-wrap gap-3">
                    {keptImages.map(img => (
                        <div
                            key={img.id}
                            className="relative group border rounded-lg overflow-hidden"
                            style={{ width: 104, height: 104 }}
                        >
                            <Image
                                src={img.image_url}
                                alt="Product"
                                width={104}
                                height={104}
                                className="object-cover"
                                preview={{ mask: 'Xem' }}
                            />
                            {thumbnailImageId === img.id && (
                                <div className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded">
                                    Thumbnail
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleSetThumbnail(img.id)}
                                    className="p-1.5 bg-white rounded-full hover:bg-yellow-100 transition-colors"
                                    title="Đặt làm thumbnail"
                                >
                                    {thumbnailImageId === img.id ? (
                                        <StarFilled className="text-yellow-500" />
                                    ) : (
                                        <StarOutlined className="text-gray-600" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveExistingImage(img.id)}
                                    className="p-1.5 bg-white rounded-full hover:bg-red-100 transition-colors"
                                    title="Xóa ảnh"
                                >
                                    <DeleteOutlined className="text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Tab items
    const tabItems = [
        {
            key: 'basic',
            label: (
                <span className="gap-0.5">
                    <InfoCircleOutlined />
                    <span>Thông tin cơ bản</span>
                </span>
            ),
            children: (
                <div className="py-4">
                    <Row gutter={[16, 0]}>
                        <Col span={24}>
                            <Form.Item
                                name="name"
                                label="Tên sản phẩm"
                                rules={[
                                    { required: true, message: 'Bạn phải nhập tên sản phẩm' },
                                    { min: 3, message: 'Tên sản phẩm ít nhất 3 ký tự' },
                                ]}
                            >
                                <Input placeholder="Nhập tên sản phẩm" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Mô tả sản phẩm"
                                rules={[{ required: true, message: 'Bạn phải nhập mô tả' }]}
                            >
                                <TextArea rows={4} placeholder="Mô tả chi tiết về sản phẩm" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="category_id"
                                label={
                                    <Space>
                                        <span>Danh mục</span>
                                        <Button
                                            type="link"
                                            size="small"
                                            icon={<PlusOutlined />}
                                            onClick={handleAddCategory}
                                            className="p-0"
                                        >
                                            Thêm mới
                                        </Button>
                                    </Space>
                                }
                                rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Chọn danh mục"
                                    optionFilterProp="label"
                                    virtual
                                    listHeight={200}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '')
                                            .toLowerCase()
                                            .localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={category_options}
                                    onChange={value => {
                                        form.setFieldsValue({
                                            brand_id: undefined,
                                            series_id: undefined,
                                        });
                                        setMappingSeries([]);
                                        setMappingBrands(
                                            brand_options
                                                .filter(item => item.category_id == value)
                                                .map(item => ({
                                                    label: item.name,
                                                    value: item.id.toString(),
                                                }))
                                        );
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="brand_id"
                                label={
                                    <Space>
                                        <span>Thương hiệu</span>
                                        <Button
                                            type="link"
                                            size="small"
                                            icon={<PlusOutlined />}
                                            onClick={handleAddBrand}
                                            className="p-0"
                                        >
                                            Thêm mới
                                        </Button>
                                    </Space>
                                }
                                rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Chọn thương hiệu"
                                    optionFilterProp="label"
                                    disabled={mappingBrands.length === 0}
                                    virtual
                                    listHeight={200}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '')
                                            .toLowerCase()
                                            .localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    onChange={value => {
                                        form.setFieldsValue({ series_id: undefined });
                                        setMappingSeries(
                                            serie_options
                                                .filter(item => item.brand_id == value)
                                                .map(item => ({
                                                    label: item.name,
                                                    value: item.id.toString(),
                                                }))
                                        );
                                    }}
                                    options={mappingBrands}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="series_id"
                                label={
                                    <Space>
                                        <span>Dòng sản phẩm</span>
                                        <Button
                                            type="link"
                                            size="small"
                                            icon={<PlusOutlined />}
                                            onClick={handleAddSeries}
                                            className="p-0"
                                        >
                                            Thêm mới
                                        </Button>
                                    </Space>
                                }
                                rules={[{ required: true, message: 'Vui lòng chọn dòng sản phẩm' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Chọn dòng sản phẩm"
                                    optionFilterProp="label"
                                    disabled={mappingSeries.length === 0}
                                    virtual
                                    listHeight={200}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '')
                                            .toLowerCase()
                                            .localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={mappingSeries}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="is_active"
                                label="Trạng thái"
                                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                            >
                                <Select
                                    placeholder="Chọn trạng thái"
                                    options={[
                                        { label: 'Đang bán', value: true },
                                        { label: 'Ngừng bán', value: false },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
            ),
        },
        {
            key: 'variants',
            label: (
                <span className="gap-0.5">
                    <AppstoreOutlined />
                    <span>Biến thể ({variants?.length || 0})</span>
                </span>
            ),
            children: (
                <div className="py-4">
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <Text>
                            Tổng số lượng tồn kho:{' '}
                            <Text strong className="text-blue-600 text-lg">
                                {totalQuantity}
                            </Text>
                        </Text>
                        <Text type="secondary" className="block text-xs">
                            (Tự động tính từ tổng số lượng các biến thể)
                        </Text>
                    </div>
                    <VariantFormList />
                </div>
            ),
        },
        {
            key: 'images',
            label: (
                <span>
                    <PictureOutlined />
                    {'  '}
                    Hình ảnh ({keepImageIds.length + thumbnailList.length + sliderList.length})
                </span>
            ),
            children: (
                <div className="py-4">
                    {renderExistingImages()}

                    <div className="text-sm font-medium mb-2">
                        {keepImageIds.length > 0 ? 'Thêm ảnh mới:' : 'Tải ảnh lên:'}
                    </div>

                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                            <div className="border rounded-lg p-4">
                                <FormItem
                                    label={
                                        <span>
                                            Ảnh đại diện{' '}
                                            {keepImageIds.length === 0 && (
                                                <Text type="danger">*</Text>
                                            )}
                                        </span>
                                    }
                                    help="Ảnh hiển thị chính của sản phẩm (tối đa 1 ảnh)"
                                >
                                    <UploadImage
                                        maxImage={MAX_THUMBNAILS}
                                        fileList={thumbnailList}
                                        setFileList={setThumbnailList}
                                    />
                                </FormItem>
                            </div>
                        </Col>
                        <Col xs={24} md={12}>
                            <div className="border rounded-lg p-4">
                                <FormItem
                                    label="Ảnh bổ sung"
                                    help="Các ảnh khác của sản phẩm (tối đa 5 ảnh)"
                                >
                                    <UploadImage
                                        maxImage={MAX_SLIDERS}
                                        fileList={sliderList}
                                        setFileList={setSliderList}
                                    />
                                </FormItem>
                            </div>
                        </Col>
                    </Row>
                </div>
            ),
        },
        {
            key: 'specs',
            label: (
                <span>
                    <SettingOutlined />
                    {'  '}
                    Thông số kỹ thuật
                </span>
            ),
            children: (
                <div className="py-4">
                    <SpecFormList />
                </div>
            ),
        },
    ];

    return (
        <Modal
            title={<span className="text-xl font-semibold">Chỉnh sửa sản phẩm</span>}
            open={isModalOpen}
            onOk={onSubmit}
            onCancel={handleClose}
            width={900}
            okText="Lưu thay đổi"
            cancelText="Hủy"
            okButtonProps={{
                loading: loading,
                disabled: fetchLoading,
            }}
            destroyOnHidden
            maskClosable={false}
        >
            {fetchLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Spin size="large" tip="Đang tải thông tin sản phẩm..." />
                </div>
            ) : (
                <Form<IAddProductFormValues>
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
                </Form>
            )}

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
