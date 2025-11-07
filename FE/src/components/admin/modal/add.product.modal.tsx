import { postCreateProduct, type IBrand } from '@/services/admin/products/admin.product.api';
import {
    Col,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    type FormProps,
    type UploadFile,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import { UploadImage } from '@/components/admin/upload.img';
import FormItem from 'antd/es/form/FormItem';
import { uploadMultipleImgAPI } from '@/services/global';
import type { RcFile } from 'antd/es/upload';

const MAX_THUMBNAILS = 1;
const MAX_SLIDERS = 5;

interface IProps {
    isModalOpen: boolean;
    setIsOpenModal: (v: boolean) => void;
    brand_options: IBrand[];
    category_options: { label: string; value: string }[];
    serie_options: { id: number; name: string; brand_id: number }[];
}

interface IAddProduct {
    name: string;
    description: string;
    quantity: number;
    brand_id: number;
    category_id: number;
    is_active: string;
    series_id: number;
}

export const AddProductModal = (props: IProps) => {
    const { isModalOpen, setIsOpenModal, brand_options, category_options, serie_options } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [mappingSeries, setMappingSeries] = useState<{ label: string; value: string }[]>([]);
    const [mappingBrands, setMappingBrands] = useState<{ label: string; value: string }[]>([]);
    const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]);
    const [sliderList, setSliderList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm();

    const onFinish: FormProps<IAddProduct>['onFinish'] = async values => {
        console.log(values);
        const files = [...thumbnailList, ...sliderList].map(item => item.originFileObj as RcFile);
        setLoading(true);
        if (files) {
            const uploadResults = await uploadMultipleImgAPI(files, 'product');
        }
        try {
            setLoading(true);
            // await postCreateProduct({
            //     name: values.name,
            //     brand_id: values.brand_id,
            //     category_id: values.category_id,
            //     description: values.description,
            //     is_active: values.is_active == 'true' ? true : false,
            //     quantity: values.quantity,
            //     series_id: values.series_id,
            // })
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const onFinishFailed: FormProps<IAddProduct>['onFinishFailed'] = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const onSubmit = () => {
        form.submit();
    };

    return (
        <>
            <Modal
                title="Thêm mới sản phẩm"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={onSubmit}
                onCancel={() => setIsOpenModal(false)}
                width={800}
                okButtonProps={{
                    loading: loading,
                }}
            >
                <Form<IAddProduct>
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Row justify={'space-between'}>
                        <Col span={24}>
                            <Form.Item<IAddProduct>
                                name="name"
                                label="Tên sản phẩm"
                                rules={[{ required: true, message: 'Bạn phải nhập tên sản phẩm' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item<IAddProduct>
                                name="description"
                                label="Mô tả sản phẩm"
                                initialValue={''}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <TextArea />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<IAddProduct>
                                name="quantity"
                                label="Số lượng sản phẩm"
                                rules={[
                                    { required: true, message: 'Bạn phải nhập số lượng sản phẩm' },
                                ]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item<IAddProduct>
                                name="category_id"
                                label="category_id"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn loại sản phẩm',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="Search to Select"
                                    optionFilterProp="label"
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '')
                                            .toLowerCase()
                                            .localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={category_options}
                                    onChange={value =>
                                        setMappingBrands(
                                            brand_options
                                                .filter(item => item.category_id == value)
                                                .map(item => ({
                                                    label: item.name,
                                                    value: item.id.toString(),
                                                }))
                                        )
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<IAddProduct>
                                name="brand_id"
                                label="brand_id"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="Search to Select"
                                    optionFilterProp="label"
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '')
                                            .toLowerCase()
                                            .localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    onChange={value =>
                                        setMappingSeries(
                                            serie_options
                                                .filter(item => item.brand_id == value)
                                                .map(item => ({
                                                    label: item.name,
                                                    value: item.id.toString(),
                                                }))
                                        )
                                    }
                                    options={mappingBrands}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item<IAddProduct>
                                name="series_id"
                                label="series_id"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="Search to Select"
                                    optionFilterProp="label"
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '')
                                            .toLowerCase()
                                            .localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={mappingSeries}
                                ></Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<IAddProduct>
                                name="is_active"
                                label="Status"
                                initialValue={true}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Select
                                    options={[
                                        { label: 'Còn bán', value: 'true' },
                                        { label: 'Ngừng bán', value: 'false' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={10}></Col>
                        <Col span={10}>
                            <FormItem label={'Thumbnail'}>
                                <UploadImage
                                    maxImage={MAX_THUMBNAILS}
                                    fileList={thumbnailList}
                                    setFileList={setThumbnailList}
                                />
                            </FormItem>
                        </Col>
                        <Col span={10}>
                            <FormItem label={'Sliders'}>
                                <UploadImage
                                    maxImage={MAX_SLIDERS}
                                    fileList={sliderList}
                                    setFileList={setSliderList}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};
