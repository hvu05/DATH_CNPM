import { delay } from '@/helpers/seller/helper';
import {
    acceptDeliverAPI,
    acceptReturnRqAPI,
    completeDeliverAPI,
    type IOrder,
} from '@/services/seller/seller.service';
import { App, type MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';

export const getActionItems = (order: IOrder): MenuProps['items'] => {
    const navigate = useNavigate();
    const { notification, message } = App.useApp();
    const items: MenuProps['items'] = [
        {
            key: 'detail',
            label: 'Chi tiết đơn hàng',
            onClick: () => navigate(`/seller/order/${order.id}`, { state: { order } }),
        },
    ];
    // Add action buttons based on status
    switch (order.status) {
        case 'PROCESSING':
            items.push(
                { type: 'divider' },
                {
                    key: 'confirm##1',
                    label: <span className="text-green-400">Xác nhận đơn</span>,
                    danger: false,
                    onClick: async () => {
                        try {
                            await acceptDeliverAPI(order.id);
                            message.success('Thành công');
                            await delay(1000);
                            window.location.reload();
                        } catch (error: any) {
                            console.log(error);
                            notification.error({
                                message: 'Error',
                                description: error.response.data.error,
                            });
                        }
                    },
                }
            );
            break;
        case 'DELIVERING':
            items.push(
                { type: 'divider' },
                {
                    key: 'completed##1',
                    label: <span className="text-green-500">Giao hàng thành công</span>,
                    danger: false,
                    onClick: async () => {
                        try {
                            await completeDeliverAPI(order.id);
                            message.success('Thành công');
                            await delay(1000);
                            window.location.reload();
                        } catch (error: any) {
                            notification.error({
                                message: 'Error',
                                description: error.response.data.error,
                            });
                        }
                    },
                }
            );
            break;
        case 'RETURN_REQUEST':
            items.push(
                { type: 'divider' },
                {
                    key: 'returnrequest##1',
                    label: <span className="text-red-500">Xác nhận trả hàng</span>,
                    danger: false,
                    onClick: async () => {
                        try {
                            message.loading('Đang xử lý trả hàng...', 0);

                            await acceptReturnRqAPI(order.id);

                            message.destroy();
                            message.success('Xác nhận trả hàng thành công');

                            // await delay(1000);
                            // window.location.reload();
                        } catch (error: any) {
                            message.destroy();
                            console.error('Return request error:', error);
                            notification.error({
                                message: 'Lỗi xác nhận trả hàng',
                                description:
                                    error.response?.data?.error ||
                                    'Không thể xác nhận yêu cầu trả hàng',
                            });
                        }
                    },
                }
            );
            break;
        default:
            break;
    }

    return items;
};
