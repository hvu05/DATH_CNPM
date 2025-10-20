import { updateUserByID, type IUser, type TRole } from "@/services/test/api";
import { FormOutlined } from "@ant-design/icons";
import { Form, Input, message, Modal, Select, type FormProps } from "antd";
import { useEffect } from "react";

interface IProps {
    user: IUser | null;
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    setCurrentUser: (v: IUser | null) => void;
}

type FieldType = {
    _id: string;
    fullName: string;
    email: string;
    role: TRole;
    isActive: boolean;
};

export const UpdateUserModal = (props: IProps) => {
    const { user, isOpen, setIsOpen, setCurrentUser } = props;
    const [form] = Form.useForm<FieldType>();
    const roles = [{ label: 'admin', value: 'admin' }, { label: 'seller', value: 'seller' }, { label: 'customer', value: 'customer' }];

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { _id, email, fullName, isActive, role } = values;
        console.log({ values })
        const result = await updateUserByID(_id, fullName, email, role, isActive);
        if (result.data) {
            message.success('Update successfully !!!');
            setIsOpen(false);
            setCurrentUser(null);
        }
        else {
            console.log('errror')
            message.error(result.message);
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        if (isOpen && user) {
            form.setFieldsValue({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                isActive: user.isActive,
                role: user.role,
            })
        }
        else {
            setCurrentUser(null);
        }
    }, [isOpen, user])

    return (
        <>
            <Modal
                title={<span> <FormOutlined /> Update user</span>}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsOpen(false)}
            >
                <Form
                    name="basic"
                    form={form}
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item<FieldType>
                        label="ID"
                        name="_id"
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Fullname"
                        name="fullName"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Active"
                        name="isActive"
                    >
                        <Select options={[{ label: 'active', value: true }, { label: 'inactive', value: false }]} />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Role"
                        name="role"
                    >
                        <Select options={roles} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}