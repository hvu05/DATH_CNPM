import { useLocation, useNavigate } from 'react-router-dom';
import './index.scss';
import '@/assets/seller/user.svg';

type PathName = 'orders' | 'status' | 'seller';

export const Tab = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActiveLink = (path: PathName) => {
        if (path === 'seller') {
            return location.pathname.slice(1) === path || location.pathname.includes('profile');
        }
        return location.pathname.includes(path);
    };

    return (
        <>
            <div className="seller-tab-container">
                <ul>
                    <li
                        className={`${isActiveLink('seller') ? 'tab--active' : ''}`}
                        onClick={() => navigate('/seller')}
                    >
                        <span>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    cx="12"
                                    cy="10"
                                    r="3"
                                    stroke="currentcolor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                    stroke="currentcolor"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M17.7805 18.8264C17.9076 18.7566 17.9678 18.6055 17.914 18.4708C17.5284 17.5045 16.7856 16.6534 15.7814 16.0332C14.6966 15.3632 13.3674 15 12 15C10.6326 15 9.30341 15.3632 8.21858 16.0332C7.21444 16.6534 6.4716 17.5045 6.08598 18.4708C6.03223 18.6055 6.09236 18.7566 6.21948 18.8264C9.81971 20.803 14.1803 20.803 17.7805 18.8264Z"
                                    fill="currentcolor"
                                />
                            </svg>
                        </span>
                        <span>Xem hồ sơ</span>
                    </li>
                    <li
                        className={`${isActiveLink('orders') ? 'tab--active' : ''}`}
                        onClick={() => navigate('/seller/orders')}
                    >
                        <span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M12 21V13M12 21L4.94 16.5875C4.48048 16.3003 4.25072 16.1567 4.12536 15.9305C4 15.7043 4 15.4334 4 14.8915V8M12 21L16 18.5L19.06 16.5875C19.5195 16.3003 19.7493 16.1567 19.8746 15.9305C20 15.7043 20 15.4334 20 14.8915V8M12 13L4 8M12 13L20 8M4 8L10.94 3.6625C11.4555 3.34033 11.7132 3.17925 12 3.17925C12.2868 3.17925 12.5445 3.34033 13.06 3.6625L20 8"
                                    stroke="currentcolor"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M15 14.5C15 15.0523 15.4477 15.5 16 15.5C16.5523 15.5 17 15.0523 17 14.5H16H15ZM15.8746 10.5695L16.7493 10.0847L15.8746 10.5695ZM8 5.5L7.47 6.348L14.53 10.7605L15.06 9.9125L15.59 9.0645L8.53 4.652L8 5.5ZM16 14.5H17V11.6085H16H15V14.5H16ZM15.06 9.9125L14.53 10.7605C14.7757 10.9141 14.9004 10.9932 14.9843 11.0575C15.0512 11.1089 15.027 11.1029 15 11.0542L15.8746 10.5695L16.7493 10.0847C16.5969 9.80984 16.3951 9.61902 16.201 9.47022C16.0238 9.33438 15.8038 9.19813 15.59 9.0645L15.06 9.9125ZM16 11.6085H17C17 11.3564 17.0011 11.0976 16.9798 10.8753C16.9565 10.6319 16.9016 10.3596 16.7493 10.0847L15.8746 10.5695L15 11.0542C14.973 11.0056 14.9808 10.9818 14.9889 11.0659C14.9989 11.1711 15 11.3187 15 11.6085H16Z"
                                    fill="currentcolor"
                                />
                            </svg>
                        </span>
                        <span>Quản lí đơn hàng</span>
                    </li>
                    <li
                        onClick={() => navigate('/seller/status')}
                        className={`${isActiveLink('status') ? 'tab--active' : ''}`}
                    >
                        <span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle
                                    cx="16"
                                    cy="19"
                                    r="2"
                                    stroke="currentcolor"
                                    strokeWidth="2"
                                />
                                <circle
                                    cx="9"
                                    cy="19"
                                    r="2"
                                    stroke="currentcolor"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M5 14H11V7M11 7V9H4V17C4 18.1046 4.89543 19 6 19H7M11 7H15L19.6247 10.6998C19.8619 10.8895 20 11.1768 20 11.4806V13M17 9H16V13H20M20 13V17C20 18.1046 19.1046 19 18 19M14 19H11"
                                    stroke="currentcolor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                        <span>Cập nhật trạng thái</span>
                    </li>
                    <li>
                        <span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="22"
                                viewBox="0 0 16 22"
                                fill="none"
                            >
                                <path
                                    d="M1 6.13193V5.61204C1 3.46614 1 2.3932 1.6896 1.79511C2.37919 1.19703 3.44136 1.34877 5.56569 1.65224L9.84853 2.26408C12.3047 2.61495 13.5327 2.79039 14.2664 3.63628C15 4.48217 15 5.72271 15 8.20377V13.7962C15 16.2773 15 17.5178 14.2664 18.3637C13.5327 19.2096 12.3047 19.385 9.84853 19.7359L5.56568 20.3478C3.44136 20.6512 2.37919 20.803 1.6896 20.2049C1 19.6068 1 18.5339 1 16.388V16.066"
                                    stroke="currentcolor"
                                    strokeWidth="2"
                                />
                            </svg>
                        </span>
                        <span>Đăng xuất</span>
                    </li>
                </ul>
            </div>
        </>
    );
};
