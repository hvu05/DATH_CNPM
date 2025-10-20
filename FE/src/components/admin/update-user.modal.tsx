import { updateUserByID, type IUser, type TRole } from "@/services/test/api";
import { FormOutlined, UserOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons";
import { Form, Input, message, Modal, Select, type FormProps, Switch } from "antd";
import { useEffect, useCallback } from "react";

interface IUpdateUserModalProps {
    user: IUser | null;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    setCurrentUser: (user: IUser | null) => void;
}

interface IUpdateUserForm {
    _id: string;
    fullName: string;
    email: string;
    role: TRole;
    isActive: boolean;
}

const ROLE_OPTIONS = [
    { label: 'Admin', value: 'admin' },
    { label: 'Seller', value: 'seller' },
    { label: 'Customer', value: 'customer' }
];

const useUpdateUserModal = (user: IUser | null, isOpen: boolean, setIsOpen: (isOpen: boolean) => void, setCurrentUser: (user: IUser | null) => void) => {
    const [form] = Form.useForm<IUpdateUserForm>();

    const resetForm = () => {
        form.resetFields();
        setCurrentUser(null);
        setIsOpen(false);
    }

    const handleSubmit = async (values: IUpdateUserForm) => {
        try {
            const { _id, email, fullName, isActive, role } = values;

            const result = await updateUserByID(_id, fullName, email, role, isActive);

            if (result.data) {
                message.success('Cập nhật thông tin người dùng thành công!');
                resetForm();
            } else {
                message.error(result.message || 'Cập nhật thất bại');
            }
        } catch (error) {
            console.error('Update user error:', error);
            message.error('Đã xảy ra lỗi khi cập nhật thông tin người dùng');
        }
    }

    const handleCancel = () => {
        resetForm();
    }

    const handleFormFailed = (errorInfo: any) => {
        console.log('Form validation failed:', errorInfo);
        message.error('Vui lòng kiểm tra lại thông tin nhập vào');
    }

    return {
        form,
        handleSubmit,
        handleCancel,
        handleFormFailed
    };
};

export const UpdateUserModal = ({ user, isOpen, setIsOpen, setCurrentUser }: IUpdateUserModalProps) => {
    const { form, handleSubmit, handleCancel, handleFormFailed } = useUpdateUserModal(user, isOpen, setIsOpen, setCurrentUser);

    useEffect(() => {
        if (isOpen && user) {
            form.setFieldsValue({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                isActive: user.isActive,
                role: user.role,
            });
        }
    }, [isOpen, user]);

    return (
        <Modal
            title={
                <span className="flex items-center gap-2">
                    <FormOutlined />
                    Cập nhật thông tin người dùng
                </span>
            }
            open={isOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            okText="Cập nhật"
            cancelText="Hủy"
            width={600}
        >
            <Form<IUpdateUserForm>
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                onFinishFailed={handleFormFailed}
                autoComplete="off"
                preserve={false}
            >
                <Form.Item<IUpdateUserForm>
                    label="ID người dùng"
                    name="_id"
                >
                    <Input
                        prefix={<UserOutlined />}
                        disabled
                        placeholder="ID người dùng"
                    />
                </Form.Item>

                <Form.Item<IUpdateUserForm>
                    label="Họ và tên"
                    name="fullName"
                    rules={[
                        { required: true, message: 'Vui lòng nhập họ và tên' },
                        { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự' },
                        { max: 50, message: 'Họ và tên không được vượt quá 50 ký tự' }
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Nhập họ và tên"
                    />
                </Form.Item>

                <Form.Item<IUpdateUserForm>
                    label="Email"
                    name="email"
                >
                    <Input
                        prefix={<MailOutlined />}
                        disabled
                        placeholder="Email"
                    />
                </Form.Item>

                <Form.Item<IUpdateUserForm>
                    label={<span className="flex items-center gap-2"><SettingOutlined /> Vai trò</span>}
                    name="role"
                    rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                >
                    <Select
                        placeholder="Chọn vai trò"
                        options={ROLE_OPTIONS}
                    />
                </Form.Item>

                <Form.Item<IUpdateUserForm>
                    label="Trạng thái tài khoản"
                    name="isActive"
                    valuePropName="checked"
                >
                    <Switch
                        checkedChildren="Hoạt động"
                        unCheckedChildren="Khóa"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};