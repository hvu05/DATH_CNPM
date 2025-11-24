import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // === THAY ĐỔI 1: Import Link ===
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './BannerSlider.scss';

interface Banner {
    id: number;
    title: string;
    image: string;
    link?: string;
}

interface BannerSliderProps {
    banners: Banner[];
}

const BannerSlider: React.FC<BannerSliderProps> = ({ banners }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide(prev => (prev === banners.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide(prev => (prev === 0 ? banners.length - 1 : prev - 1));
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(timer);
    }, [currentSlide]);

    return (
        <div className="banner-slider">
            <div
                className="banner-slider__container"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`banner-slider__slide ${index === currentSlide ? 'active' : ''}`}
                    >
                        {banner.link ? (
                            <Link to={banner.link}>
                                <img src={banner.image} alt={banner.title} />
                            </Link>
                        ) : (
                            <img src={banner.image} alt={banner.title} />
                        )}
                    </div>
                ))}
            </div>

            <button className="banner-slider__prev" onClick={prevSlide}>
                <LeftOutlined />
            </button>
            <button className="banner-slider__next" onClick={nextSlide}>
                <RightOutlined />
            </button>

            <div className="banner-slider__dots">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        className={`banner-slider__dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerSlider;
