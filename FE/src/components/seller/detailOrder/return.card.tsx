import { Image, Skeleton } from 'antd';
import type { IOrderReturnRequest } from '@/services/seller/seller.service';
import defaultImage from '@/assets/seller/default_order.webp';

export const ReturnCard = ({
    returnData,
    loading,
}: {
    returnData: IOrderReturnRequest | null;
    loading: boolean;
}) => {
    if (loading) {
        return (
            <div className="seller-order-detail__card">
                <h2 className="seller-order-detail__card-title">Thông tin trả hàng</h2>
                <Skeleton active paragraph={{ rows: 3 }} />
            </div>
        );
    }

    if (!returnData) {
        return null;
    }

    return (
        <div className="seller-order-detail__card">
            <h2 className="seller-order-detail__card-title">Thông tin trả hàng</h2>

            <div className="seller-order-detail__customer-info">
                <div className="seller-order-detail__info-group">
                    <p>
                        <span className="seller-order-detail__info-label">Lý do trả hàng:</span>{' '}
                        <span className="seller-order-detail__info-value">
                            {returnData.reason || 'Không có lý do'}
                        </span>
                    </p>
                    <p>
                        <span className="seller-order-detail__info-label">Ngày yêu cầu trả:</span>{' '}
                        <span className="seller-order-detail__info-value">
                            {new Date(returnData.create_at).toLocaleString('vi-VN')}
                        </span>
                    </p>
                </div>

                {returnData.images && returnData.images.length > 0 && (
                    <div className="seller-order-detail__info-group">
                        <div>
                            <div className="seller-order-detail__info-label">
                                Hình ảnh minh chứng
                            </div>
                            <div className="seller-order-detail__image-gallery">
                                {returnData.images.map((image, index) => (
                                    <div key={index} className="seller-order-detail__image-item">
                                        <Image
                                            src={image}
                                            alt={`Minh chứng ${index + 1}`}
                                            className="seller-order-detail__return-image"
                                            fallback={defaultImage}
                                            preview={{
                                                mask: 'Xem ảnh',
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
