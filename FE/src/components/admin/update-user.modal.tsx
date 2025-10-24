import { updateUserAPI } from "@/services/user/api";
import { FormOutlined, UserOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Select, Switch } from "antd";
import useApp from "antd/es/app/useApp";
import { useEffect, useState } from "react";

interface IUpdateUserModalProps {
    user: IUser | null;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    setCurrentUser: (user: IUser | null) => void;
    refreshUsers: () => void;
    roles: { label: string, value: number }[]
}

interface IUpdateUserForm {
    id: string;
    full_name: string;
    email: string;
    role: number;
    is_active: boolean;
}

export const UpdateUserModal = (props: IUpdateUserModalProps) => {
    const [form] = Form.useForm<IUpdateUserForm>();
    const [loading, setLoading] = useState(false);
    const { user, isOpen, setIsOpen, setCurrentUser, refreshUsers, roles } = props;
    const { message } = useApp();

    const resetForm = () => {
        form.resetFields();
        setCurrentUser(null);
        setIsOpen(false);
    }

    const handleSubmit = async (values: IUpdateUserForm) => {
        setLoading(true);
        try {
            const { id, full_name, role, is_active } = values;

            const result = await updateUserAPI(id, {
                full_name: full_name,
                role_id: role,
                is_active: is_active
            });
            if (result.data) {
                message.success('Cập nhật thông tin người dùng thành công!');
                resetForm();
                refreshUsers();
            } else {
                message.error(result.message || 'Cập nhật thất bại');
            }
        } catch (error: any) {
            console.error('Update user error:', error);
            message.error(error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật thông tin người dùng');
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = () => {
        resetForm();
    }

    const handleFormFailed = (errorInfo: any) => {
        console.log('Form validation failed:', errorInfo);
        message.error('Vui lòng kiểm tra lại thông tin nhập vào');
    }

    useEffect(() => {
        if (isOpen && user) {
            form.setFieldsValue({
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                is_active: user.is_active,
                role: roles.find(item => item.label === user.role)?.value ?? -1,
            });
        }
    }, [user, isOpen, form]);

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
            confirmLoading={loading}
        >
            <Form<IUpdateUserForm>
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                onFinishFailed={handleFormFailed}
            >
                <Form.Item<IUpdateUserForm>
                    label="ID người dùng"
                    name="id"
                >
                    <Input
                        prefix={<UserOutlined />}
                        disabled
                        placeholder="ID người dùng"
                    />
                </Form.Item>

                <Form.Item<IUpdateUserForm>
                    label="Họ và tên"
                    name="full_name"
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
                        options={roles}
                    />
                </Form.Item>

                <Form.Item<IUpdateUserForm>
                    label="Trạng thái tài khoản"
                    name="is_active"
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