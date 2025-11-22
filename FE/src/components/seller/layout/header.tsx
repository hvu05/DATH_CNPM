import './header.scss';
import homeIcon from '@/assets/home-icon.svg';
import menuIcon from '@/assets/menu-icon.svg';
import searchIcon from '@/assets/search-icon.svg';
import cartIcon from '@/assets/cart-icon.svg';
import defaultAvatar from '@/assets/default-avatar-icon.svg';
import { Link } from 'react-router-dom';

export const Header = () => {
    return (
        <header className="seller-header" style={{ zIndex: '100' }}>
            <div className="seller-header__left">
                <Link to={'/'} className="seller-header__home-link">
                    <img src={homeIcon} alt="Home" />
                </Link>
                <button className="seller-header__button seller-header__button--category">
                    <img src={menuIcon} alt="Menu" className="seller-header__button-icon" />
                    <span className="seller-header__button-text">Danh mục</span>
                </button>
            </div>

            <div className="seller-header__search">
                <input
                    type="text"
                    className="seller-header__search-input"
                    placeholder="Tìm kiếm sản phẩm..."
                />
                <img src={searchIcon} alt="Search" className="seller-header__search-icon" />
            </div>

            <div className="seller-header__right">
                {/* <button className="seller-header__button seller-header__button--cart">
                    <img src={cartIcon} alt="Cart" className="seller-header__button-icon" />
                    <span className="seller-header__button-text">Giỏ hàng</span>
                </button> */}
                <img src={defaultAvatar} alt="Avatar" className="seller-header__avatar" />
            </div>
        </header>
    );
};
