import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { App, Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import type { RcFile as OriRcFile, UploadRequestOption as RcCustomRequestOptions, UploadProps as RcUploadProps, UploadRequestOption } from 'rc-upload/lib/interface';

interface IProps {
    maxImage: number;
    fileList: UploadFile[];
    setFileList: (v: UploadFile[]) => void;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const dummyRequest = ({ file, onSuccess }: UploadRequestOption) => {
    setTimeout(() => {
        if (onSuccess) {
            onSuccess("ok");
        }
    }, 0);
};


export const UploadImage = (props: IProps) => {
    const { maxImage, fileList, setFileList } = props;
    const [previewOpen, setPreviewOpen] = useState(false);
    const { message } = App.useApp();
    const [previewImage, setPreviewImage] = useState('');

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        let isJpgOrPng = true;
        let isLt2M = true;
        const fileList = newFileList.filter(item => {
            if ((item.type === 'image/jpeg' || item.type === 'image/png') && (item.size! / 1024 / 1024 < 2)) {
                return item;
            }
            else {
                isJpgOrPng = item.type! === 'image/jpeg' || item.type! === 'image/png';
                isLt2M = item.size! / 1024 / 1024 < 2;
            }
        })
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        setFileList(fileList);
    }


    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    return (
        <>
            <Upload
                customRequest={dummyRequest}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                multiple={true}
            >
                {fileList.length >= maxImage ? null : uploadButton}
            </Upload>
            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </>
    );
};
