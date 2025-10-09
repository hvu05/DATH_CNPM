import './header.scss'
import homeIcon from '@/assets/home-icon.svg'
import menuIcon from '@/assets/menu-icon.svg'
import searchIcon from '@/assets/search-icon.svg'
import cartIcon from '@/assets/cart-icon.svg'
import defaultAvatar from '@/assets/default-avatar-icon.svg'
import { Link } from 'react-router'

export const Header = () => {
    return (
        <>
            <header>
                <div className="left-header">
                    <Link to={'/'}>
                        <div className='home'>
                            <img src={homeIcon} alt="home" />
                        </div>
                    </Link>
                    <button>
                        <img src={menuIcon} alt="menu" />
                        <span>Danh mục</span>
                    </button>
                </div>
                <div className="input-search">
                    <input type="text" />
                    <img src={searchIcon} alt="search" />
                </div>
                <div className="right-header">
                    <button>
                        <img src={cartIcon} alt="cart" />
                        <span>Giỏ hàng</span>
                    </button>
                    <img src={defaultAvatar} alt="avatar" className="avatar" />
                </div>
            </header>
        </>
    )
}