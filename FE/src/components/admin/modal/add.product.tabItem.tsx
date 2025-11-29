import {
    Col,
    Form,
    Input,
    Row,
    Select,
    Typography,
    type FormInstance,
    type UploadFile,
    Button,
    Space,
    Image,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { UploadImage } from '@/components/admin/upload.img';
import FormItem from 'antd/es/form/FormItem';
import { VariantFormList, SpecFormList } from '@/components/admin/product';
import {
    InfoCircleOutlined,
    AppstoreOutlined,
    PictureOutlined,
    SettingOutlined,
    PlusOutlined,
    DeleteOutlined,
    StarFilled,
    StarOutlined,
    SaveOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import type { IAddProductFormValues, IBrand, IProductImage } from '@/types/admin/product';

const { Text } = Typography;
const MAX_THUMBNAILS = 1;
const MAX_SLIDERS = 5;

interface Props {
    form: FormInstance<IAddProductFormValues>;
    totalQuantity: number;
    thumbnailList: UploadFile[];
    sliderList: UploadFile[];
    setThumbnailList: (files: UploadFile[]) => void;
    setSliderList: (files: UploadFile[]) => void;
    mappingBrands: { label: string; value: string }[];
    mappingSeries: { label: string; value: string }[];
    setMappingBrands: (brands: { label: string; value: string }[]) => void;
    setMappingSeries: (series: { label: string; value: string }[]) => void;
    brand_options: IBrand[];
    category_options: { label: string; value: string }[];
    serie_options: { id: number; name: string; brand_id: number }[];
    // Callbacks for adding new metadata
    onAddCategory?: () => void;
    onAddBrand?: () => void;
    onAddSeries?: () => void;
    // Edit mode props
    isEditMode?: boolean;
    existingImages?: IProductImage[];
    keepImageIds?: number[];
    thumbnailImageId?: number | null;
    onRemoveExistingImage?: (imageId: number) => void;
    onSetThumbnail?: (imageId: number) => void;
    // Edit mode save handlers
    onSaveInfo?: () => void;
    onSaveVariants?: () => void;
    onSaveSpecs?: () => void;
    onSaveImages?: () => void;
    savingTab?: string | null;
    savedTabs?: Set<string>;
}

export const AddProductTabItems = ({
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
    onAddCategory,
    onAddBrand,
    onAddSeries,
    // Edit mode props
    isEditMode = false,
    existingImages = [],
    keepImageIds = [],
    thumbnailImageId = null,
    onRemoveExistingImage,
    onSetThumbnail,
    // Edit mode save handlers
    onSaveInfo,
    onSaveVariants,
    onSaveSpecs,
    onSaveImages,
    savingTab,
    savedTabs = new Set(),
}: Props) => {
    // Render save button for edit mode
    const renderSaveButton = (tabKey: string, onSave?: () => void) => {
        if (!isEditMode || !onSave) return null;
        const isSaving = savingTab === tabKey;
        const isSaved = savedTabs.has(tabKey);

        return (
            <div className="flex justify-end mt-4 pt-4 border-t">
                <Button
                    type="primary"
                    icon={isSaved ? <CheckCircleOutlined /> : <SaveOutlined />}
                    loading={isSaving}
                    onClick={onSave}
                    className={'hover:bg-green-400'}
                >
                    Lưu
                </Button>
            </div>
        );
    };

    // Render existing images section (for edit mode)
    const renderExistingImages = () => {
        if (!isEditMode) return null;
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
                                    onClick={() => onSetThumbnail?.(img.id)}
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
                                    onClick={() => onRemoveExistingImage?.(img.id)}
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
                                        {onAddCategory && (
                                            <Button
                                                type="link"
                                                size="small"
                                                icon={<PlusOutlined />}
                                                onClick={onAddCategory}
                                                className="p-0"
                                            >
                                                Thêm mới
                                            </Button>
                                        )}
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
                                        // Reset brand and series when category changes
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
                                        {onAddBrand && (
                                            <Button
                                                type="link"
                                                size="small"
                                                icon={<PlusOutlined />}
                                                onClick={onAddBrand}
                                                className="p-0"
                                            >
                                                Thêm mới
                                            </Button>
                                        )}
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
                                        // Reset series when brand changes
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
                                        {onAddSeries && (
                                            <Button
                                                type="link"
                                                size="small"
                                                icon={<PlusOutlined />}
                                                onClick={onAddSeries}
                                                className="p-0"
                                            >
                                                Thêm mới
                                            </Button>
                                        )}
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
                                initialValue={true}
                                rules={[{ required: true }]}
                            >
                                <Select
                                    options={[
                                        { label: 'Đang bán', value: true },
                                        { label: 'Ngừng bán', value: false },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    {renderSaveButton('basic', onSaveInfo)}
                </div>
            ),
        },
        {
            key: 'variants',
            label: (
                <span className="gap-0.5">
                    <AppstoreOutlined />
                    <span>Phiên bản</span>
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
                            (Tự động tính từ tổng số lượng các phiên bản)
                        </Text>
                    </div>
                    <VariantFormList />
                    {renderSaveButton('variants', onSaveVariants)}
                </div>
            ),
        },
        {
            key: 'images',
            label: (
                <span>
                    <PictureOutlined />
                    {'  '}
                    Hình ảnh (
                    {(isEditMode ? keepImageIds.length : 0) +
                        thumbnailList.length +
                        sliderList.length}
                    )
                </span>
            ),
            children: (
                <div className="py-4">
                    {renderExistingImages()}

                    {isEditMode && keepImageIds.length > 0 && (
                        <div className="text-sm font-medium mb-2">Thêm ảnh mới:</div>
                    )}

                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                            <div className="border rounded-lg p-4">
                                <FormItem
                                    label={
                                        <span>
                                            Ảnh đại diện{' '}
                                            {(!isEditMode || keepImageIds.length === 0) && (
                                                <Text type="danger">*</Text>
                                            )}
                                        </span>
                                    }
                                    required={!isEditMode || keepImageIds.length === 0}
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
                    {renderSaveButton('images', onSaveImages)}
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
                    {renderSaveButton('specs', onSaveSpecs)}
                </div>
            ),
        },
    ];

    return tabItems;
};
