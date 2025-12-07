import {
    createProductFullAPI,
    getProductDetailAPI,
    updateProductInfoAPI,
    updateProductVariantsAPI,
    updateProductSpecsAPI,
    updateProductImagesAPI,
} from '@/services/admin/products/admin.product.api';
import { App, Form, Modal, Tabs, Spin, type FormProps, type UploadFile } from 'antd';
import { useState, useEffect } from 'react';
import { AddProductTabItems } from './add.product.tabItem';
import { AddMetadataModal } from './add.metadata.modal';
import type { RcFile } from 'antd/es/upload';
import type {
    IAddProductFormValues,
    IBrand,
    IProductImage,
    IProductVariant,
} from '@/types/admin/product';

type MetadataModalType = 'category' | 'brand' | 'series' | null;
type ModalMode = 'add' | 'edit';

interface IBaseProps {
    isModalOpen: boolean;
    setIsOpenModal: (v: boolean) => void;
    brand_options: IBrand[];
    category_options: { label: string; value: string }[];
    serie_options: { id: number; name: string; brand_id: number }[];
    onSuccess?: () => void;
    onRefreshOptions?: () => void;
}

interface IProductFormModalProps extends IBaseProps {
    mode: ModalMode;
    productId?: number | string | null;
}

// Default initial values for add mode
const defaultInitialValues: Partial<IAddProductFormValues> = {
    is_active: false,
    variants: [{ color: '', storage: '', price: 0, import_price: 0, quantity: 0 }],
    specifications: [],
};

export const ProductFormModal = (props: IProductFormModalProps) => {
    const {
        mode,
        isModalOpen,
        setIsOpenModal,
        productId,
        brand_options,
        category_options,
        serie_options,
        onSuccess,
        onRefreshOptions,
    } = props;

    const isEditMode = mode === 'edit';
    const { message, notification } = App.useApp();

    // Shared states
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [mappingSeries, setMappingSeries] = useState<{ label: string; value: string }[]>([]);
    const [mappingBrands, setMappingBrands] = useState<{ label: string; value: string }[]>([]);
    const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]);
    const [sliderList, setSliderList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm<IAddProductFormValues>();
    const [metadataModalType, setMetadataModalType] = useState<MetadataModalType>(null);

    // Edit mode specific states
    const [existingImages, setExistingImages] = useState<IProductImage[]>([]);
    const [keepImageIds, setKeepImageIds] = useState<number[]>([]);
    const [thumbnailImageId, setThumbnailImageId] = useState<number | null>(null);
    const [initialValues, setInitialValues] = useState<Partial<IAddProductFormValues> | null>(null);

    // Fetch product detail for edit mode - runs every time modal opens
    const fetchProductDetail = async () => {
        if (!isEditMode || !productId) return;

        setFetchLoading(true);
        try {
            const result = await getProductDetailAPI(productId);
            if (result.success && result.data) {
                const product = result.data;

                setExistingImages(product.product_image || []);
                setKeepImageIds(product.product_image?.map(img => img.id) || []);
                setThumbnailImageId(
                    product.product_image?.find(img => img.is_thumbnail)?.id || null
                );

                setMappingBrands(
                    brand_options
                        .filter(b => b.category_id === product.category_id)
                        .map(b => ({ label: b.name, value: b.id.toString() }))
                );
                setMappingSeries(
                    serie_options
                        .filter(s => s.brand_id === product.brand_id)
                        .map(s => ({ label: s.name, value: s.id.toString() }))
                );

                const formData = {
                    name: product.name,
                    description: product.description,
                    category_id: product.category_id?.toString() as any,
                    brand_id: product.brand_id?.toString() as any,
                    series_id: product.series_id?.toString() as any,
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
                };

                // Set form values directly - this updates the form immediately
                form.setFieldsValue(formData);
                setInitialValues(formData);
            }
        } catch (error: any) {
            console.error('Failed to fetch product:', error);
            notification.error({ message: 'Lỗi', description: 'Không thể tải thông tin sản phẩm' });
        } finally {
            setFetchLoading(false);
        }
    };

    // Fetch when modal opens in edit mode
    useEffect(() => {
        if (isModalOpen && isEditMode && productId) {
            fetchProductDetail();
        } else if (isModalOpen && !isEditMode) {
            form.setFieldsValue(defaultInitialValues);
            setInitialValues(defaultInitialValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalOpen]);

    // Re-compute mappings when options change (after adding new category/brand/series)
    useEffect(() => {
        const categoryId = form.getFieldValue('category_id');
        const brandId = form.getFieldValue('brand_id');

        if (categoryId) {
            const newMappingBrands = brand_options
                .filter(b => b.category_id == categoryId)
                .map(b => ({ label: b.name, value: b.id.toString() }));
            setMappingBrands(newMappingBrands);
        }

        if (brandId) {
            const newMappingSeries = serie_options
                .filter(s => s.brand_id == brandId)
                .map(s => ({ label: s.name, value: s.id.toString() }));
            setMappingSeries(newMappingSeries);
        }
    }, [brand_options, serie_options, form]);

    // Reset form when modal closes
    const handleClose = () => {
        form.resetFields();
        setThumbnailList([]);
        setSliderList([]);
        setMappingSeries([]);
        setMappingBrands([]);
        setActiveTab('basic');
        // Edit mode specific resets
        setExistingImages([]);
        setKeepImageIds([]);
        setThumbnailImageId(null);
        setInitialValues(null);
        // Reset save states
        setSavingTab(null);
        setSavedTabs(new Set());
        setIsOpenModal(false);
    };

    // Handlers for opening metadata modals
    const handleAddCategory = () => setMetadataModalType('category');
    const handleAddBrand = () => setMetadataModalType('brand');
    const handleAddSeries = () => setMetadataModalType('series');
    const handleCloseMetadataModal = () => setMetadataModalType(null);
    const handleMetadataSuccess = () => onRefreshOptions?.();

    // Edit mode handlers
    const handleRemoveExistingImage = (imageId: number) => {
        setKeepImageIds(prev => prev.filter(id => id !== imageId));
        if (thumbnailImageId === imageId) setThumbnailImageId(null);
    };

    const handleSetThumbnail = (imageId: number) => setThumbnailImageId(imageId);

    // Calculate total quantity from variants
    const calculateTotalQuantity = (variants: IProductVariant[] = []) =>
        variants.reduce((sum, v) => sum + (v?.quantity || 0), 0);

    // ==================== EDIT MODE: Save per tab ====================
    const [savingTab, setSavingTab] = useState<string | null>(null);
    const [savedTabs, setSavedTabs] = useState<Set<string>>(new Set());

    const handleSaveInfo = async () => {
        if (!productId) return;
        const values = form.getFieldsValue();

        // Validate basic fields
        try {
            await form.validateFields([
                'name',
                'description',
                'category_id',
                'brand_id',
                'series_id',
                'is_active',
            ]);
        } catch {
            message.error('Vui lòng điền đầy đủ thông tin cơ bản');
            return;
        }

        setSavingTab('basic');
        try {
            const result = await updateProductInfoAPI(productId, {
                name: values.name,
                description: values.description,
                brand_id: Number(values.brand_id),
                series_id: Number(values.series_id),
                category_id: Number(values.category_id),
                is_active: values.is_active,
            });
            if (result.success) {
                notification.success({ message: 'Đã lưu thông tin cơ bản' });
                setSavedTabs(prev => new Set(prev).add('basic'));
                onSuccess?.(); // Refresh parent data
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            notification.error({
                message: 'Lỗi lưu thông tin',
                description: error?.response?.data?.error || error.message,
            });
        } finally {
            setSavingTab(null);
        }
    };

    const handleSaveVariants = async () => {
        if (!productId) return;
        const values = form.getFieldsValue();

        if (!values.variants || values.variants.length === 0) {
            message.error('Cần ít nhất 1 phiên bản');
            return;
        }

        setSavingTab('variants');
        try {
            const result = await updateProductVariantsAPI(productId, {
                variants: values.variants,
            });
            if (result.success) {
                notification.success({ message: 'Đã lưu phiên bản' });
                setSavedTabs(prev => new Set(prev).add('variants'));
                onSuccess?.(); // Refresh parent data
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            notification.error({
                message: 'Lỗi lưu phiên bản',
                description: error?.response?.data?.error || error.message,
            });
        } finally {
            setSavingTab(null);
        }
    };

    const handleSaveSpecs = async () => {
        if (!productId) return;
        const values = form.getFieldsValue();

        setSavingTab('specs');
        try {
            const result = await updateProductSpecsAPI(productId, {
                specifications: values.specifications || [],
            });
            if (result.success) {
                notification.success({ message: 'Đã lưu thông số kỹ thuật' });
                setSavedTabs(prev => new Set(prev).add('specs'));
                onSuccess?.(); // Refresh parent data
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            notification.error({
                message: 'Lỗi lưu thông số',
                description: error?.response?.data?.error || error.message,
            });
        } finally {
            setSavingTab(null);
        }
    };

    const handleSaveImages = async () => {
        if (!productId) return;

        const hasExistingImages = keepImageIds.length > 0;
        const hasNewImages = thumbnailList.length > 0 || sliderList.length > 0;
        if (!hasExistingImages && !hasNewImages) {
            message.error('Cần ít nhất 1 ảnh sản phẩm');
            return;
        }

        // Collect new files
        const allFiles: File[] = [];
        thumbnailList.forEach(item => {
            if (item.originFileObj) allFiles.push(item.originFileObj as RcFile);
        });
        sliderList.forEach(item => {
            if (item.originFileObj) allFiles.push(item.originFileObj as RcFile);
        });

        setSavingTab('images');
        try {
            const result = await updateProductImagesAPI(productId, {
                keepImageIds,
                thumbnailImageId: thumbnailImageId || undefined,
                images: allFiles.length > 0 ? allFiles : undefined,
            });
            if (result.success) {
                notification.success({ message: 'Đã lưu hình ảnh' });
                setSavedTabs(prev => new Set(prev).add('images'));
                onSuccess?.(); // Refresh parent data
                // Clear new upload lists after successful save
                setThumbnailList([]);
                setSliderList([]);
                // Refresh existing images from response
                if (Array.isArray(result.data)) {
                    setExistingImages(result.data);
                    setKeepImageIds(result.data.map((img: any) => img.id));
                    const thumb = result.data.find((img: any) => img.is_thumbnail);
                    setThumbnailImageId(thumb?.id || null);
                }
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            notification.error({
                message: 'Lỗi lưu hình ảnh',
                description: error?.response?.data?.error || error.message,
            });
        } finally {
            setSavingTab(null);
        }
    };

    const onFinish: FormProps<IAddProductFormValues>['onFinish'] = async values => {
        // Edit mode: use separate save handlers per tab
        if (isEditMode && productId) {
            // Just close modal - user already saved each tab separately
            handleClose();
            onSuccess?.();
            return;
        }

        // Add mode: validate and create product with all data
        if (thumbnailList.length === 0) {
            message.error('Cần ít nhất 1 ảnh thumbnail');
            setActiveTab('images');
            return;
        }

        if (!values.variants || values.variants.length === 0) {
            message.error('Cần ít nhất 1 phiên bản sản phẩm');
            setActiveTab('variants');
            return;
        }

        setLoading(true);
        try {
            // Collect all image files
            const allFiles: File[] = [];
            thumbnailList.forEach(item => {
                if (item.originFileObj) allFiles.push(item.originFileObj as RcFile);
            });
            sliderList.forEach(item => {
                if (item.originFileObj) allFiles.push(item.originFileObj as RcFile);
            });

            // Create new product
            const result = await createProductFullAPI({
                name: values.name,
                description: values.description,
                brand_id: Number(values.brand_id),
                series_id: Number(values.series_id),
                category_id: Number(values.category_id),
                is_active: values.is_active,
                variants: values.variants,
                specifications: values.specifications || [],
                images: allFiles,
            });

            if (result.success) {
                notification.success({
                    message: 'Thành công',
                    description: `Sản phẩm "${values.name}" đã được tạo thành công!`,
                });
                handleClose();
                onSuccess?.();
            } else {
                throw new Error(result.error || 'Không thể tạo sản phẩm');
            }
        } catch (error: any) {
            console.error(error);
            notification.error({
                message: 'Lỗi',
                description: error?.response?.data?.error || error.message || 'Có lỗi xảy ra',
            });
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed: FormProps<IAddProductFormValues>['onFinishFailed'] = errorInfo => {
        const errorFields = errorInfo.errorFields;
        if (errorFields.length > 0) {
            const firstErrorField = errorFields[0].name[0];
            if (
                [
                    'name',
                    'description',
                    'category_id',
                    'brand_id',
                    'series_id',
                    'is_active',
                ].includes(String(firstErrorField))
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

    // Watch variants to show total quantity
    const variants = Form.useWatch('variants', form);
    const totalQuantity = calculateTotalQuantity(variants);

    // Check if form is ready to render
    const isReady = isEditMode ? initialValues !== null && !fetchLoading : true;
    const modalTitle = isEditMode ? 'Chỉnh sửa sản phẩm' : 'Nhập hàng mới';
    const okText = isEditMode ? 'Đóng' : 'Tạo sản phẩm';

    return (
        <Modal
            title={<span className="text-xl font-semibold">{modalTitle}</span>}
            open={isModalOpen}
            onOk={isEditMode ? handleClose : () => form.submit()}
            onCancel={handleClose}
            width={950}
            okText={okText}
            cancelText={isEditMode ? undefined : 'Hủy'}
            okButtonProps={{
                loading: loading,
                disabled: !isReady,
            }}
            cancelButtonProps={{
                style: isEditMode ? { display: 'none' } : undefined,
            }}
            destroyOnHidden
            maskClosable={false}
            styles={{
                body: {
                    maxHeight: 700,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                },
            }}
        >
            {!isReady ? (
                <div className="flex items-center justify-center py-20">
                    <Spin size="large" tip="Đang tải thông tin sản phẩm..." />
                </div>
            ) : (
                <Form<IAddProductFormValues>
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={initialValues || defaultInitialValues}
                >
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={AddProductTabItems({
                            form,
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
                            // Edit mode props
                            isEditMode,
                            existingImages,
                            keepImageIds,
                            thumbnailImageId,
                            onRemoveExistingImage: handleRemoveExistingImage,
                            onSetThumbnail: handleSetThumbnail,
                            // Edit mode save handlers
                            onSaveInfo: handleSaveInfo,
                            onSaveVariants: handleSaveVariants,
                            onSaveSpecs: handleSaveSpecs,
                            onSaveImages: handleSaveImages,
                            savingTab,
                            savedTabs,
                        })}
                    />
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

// Backward compatible exports
export const AddProductModal = (props: IBaseProps) => <ProductFormModal {...props} mode="add" />;

export const EditProductModal = (props: IBaseProps & { productId: number | string | null }) => (
    <ProductFormModal {...props} mode="edit" productId={props.productId} />
);
