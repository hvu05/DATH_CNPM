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
} from '@ant-design/icons';
import type { IAddProductFormValues, IBrand, IProductVariant } from '@/types/admin/product';

const { Text } = Typography;
const MAX_THUMBNAILS = 1;
const MAX_SLIDERS = 5;

interface Props {
    form: FormInstance<IAddProductFormValues>;
    variants?: IProductVariant[];
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
}

export const AddProductTabItems = ({
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
    onAddCategory,
    onAddBrand,
    onAddSeries,
}: Props) => {
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
                    Hình ảnh ({thumbnailList.length + sliderList.length})
                </span>
            ),
            children: (
                <div className="py-4">
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                            <div className="border rounded-lg p-4">
                                <FormItem
                                    label={
                                        <span>
                                            Ảnh đại diện <Text type="danger">*</Text>
                                        </span>
                                    }
                                    required
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

    return tabItems;
};
