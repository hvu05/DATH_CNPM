import React from 'react';
import './footer.scss';

import shieldIcon from '@/assets/policy3.svg';
import exchangeIcon from '@/assets/policy4.svg';
import policeIcon from '@/assets/policy1.svg';
import truckIcon from '@/assets/policy2.svg';

const serviceCommitments = [
    {
        icon: shieldIcon,
        title: 'Thương hiệu đảm bảo',
        description: 'Nhập khẩu, bảo hành chính hãng',
    },
    {
        icon: exchangeIcon,
        title: 'Đổi trả dễ dàng',
        description: 'Theo chính sách đổi trả tại FPT Shop',
    },
    {
        icon: policeIcon,
        title: 'Giao hàng tận nơi',
        description: 'Trên toàn quốc',
    },
    {
        icon: truckIcon,
        title: 'Sản phẩm chất lượng',
        description: 'Đảm bảo tương thích và độ bền cao',
    },
];

const Footer: React.FC = () => {
    return (
        <footer className="service-bar">
            <div className="container service-bar__container">
                {serviceCommitments.map((item, index) => (
                    <div key={index} className="service-bar__item">
                        <div className="service-bar__icon-wrapper">
                            <img src={item.icon} alt={item.title} />
                        </div>
                        <div className="service-bar__text">
                            <h4 className="service-bar__title">{item.title}</h4>
                            <p className="service-bar__description">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </footer>
    );
};

export default Footer;
