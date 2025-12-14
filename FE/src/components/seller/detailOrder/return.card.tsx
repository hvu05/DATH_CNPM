import { Image, Skeleton, Divider } from 'antd';
import type { IOrderReturnRequest } from '@/services/seller/seller.service';
import defaultImage from '@/assets/seller/default_order.webp';

export const ReturnCard = ({
    returnData,
    loading,
}: {
    returnData: IOrderReturnRequest[];
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

    if (!returnData || returnData.length === 0) {
        return null;
    }

    return (
        <div className="seller-order-detail__card">
            <h2 className="seller-order-detail__card-title">
                Thông tin trả hàng ({returnData.length} sản phẩm)
            </h2>

            <div className="seller-order-detail__customer-info">
                {returnData.map((returnItem, index) => (
                    <div key={index}>
                        <div className="seller-order-detail__info-group">
                            <p>
                                <span className="seller-order-detail__info-label">Sản phẩm:</span>{' '}
                                <span className="seller-order-detail__info-value">
                                    {returnItem.order_item?.product_variant?.name ||
                                        'Không xác định'}
                                </span>
                            </p>
                            {returnItem.order_item?.product_variant?.color && (
                                <p>
                                    <span className="seller-order-detail__info-label">
                                        Màu sắc:
                                    </span>{' '}
                                    <span className="seller-order-detail__info-value">
                                        {returnItem.order_item.product_variant.color}
                                    </span>
                                </p>
                            )}
                            {returnItem.order_item?.product_variant?.storage && (
                                <p>
                                    <span className="seller-order-detail__info-label">
                                        Dung lượng:
                                    </span>{' '}
                                    <span className="seller-order-detail__info-value">
                                        {returnItem.order_item.product_variant.storage}
                                    </span>
                                </p>
                            )}
                            <p>
                                <span className="seller-order-detail__info-label">
                                    Lý do trả hàng:
                                </span>{' '}
                                <span className="seller-order-detail__info-value">
                                    {returnItem.reason || 'Không có lý do'}
                                </span>
                            </p>
                            <p>
                                <span className="seller-order-detail__info-label">
                                    Ngày yêu cầu trả:
                                </span>{' '}
                                <span className="seller-order-detail__info-value">
                                    {new Date(returnItem.create_at).toLocaleString('vi-VN')}
                                </span>
                            </p>
                        </div>

                        {returnItem.images && returnItem.images.length > 0 && (
                            <div className="seller-order-detail__info-group">
                                <div>
                                    <div className="seller-order-detail__info-label">
                                        Hình ảnh minh chứng
                                    </div>
                                    <div className="seller-order-detail__image-gallery">
                                        {returnItem.images.map((image, imgIndex) => (
                                            <div
                                                key={imgIndex}
                                                className="seller-order-detail__image-item"
                                            >
                                                <Image
                                                    src={image}
                                                    alt={`Minh chứng ${imgIndex + 1}`}
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

                        {index < returnData.length - 1 && (
                            <Divider className="seller-order-detail__return-divider" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
