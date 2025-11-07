import './edit.profile.scss';
import defaultAvatar from '@/assets/seller/user.svg';

export const EditProfilePage = () => {
    return (
        <div className="seller-edit-profile">
            <h1 className="seller-edit-profile__title">Thông tin cá nhân</h1>
            <div className="seller-edit-profile__card">
                <div className="seller-edit-profile__main">
                    <div className="seller-edit-profile__avatar-container">
                        <img
                            src={defaultAvatar}
                            alt="avatar"
                            className="seller-edit-profile__avatar"
                        />
                    </div>
                    <div className="seller-edit-profile__row">
                        <label className="seller-edit-profile__label">Họ và tên</label>
                        <input className="seller-edit-profile__input" />
                    </div>
                    <div className="seller-edit-profile__row">
                        <label className="seller-edit-profile__label">Số điện thoại</label>
                        <input
                            className="seller-edit-profile__input disabled"
                            disabled
                            value={'09822222323'}
                        />
                    </div>
                    <div className="seller-edit-profile__row">
                        <label className="seller-edit-profile__label">Giới tính</label>
                        <div className="seller-edit-profile__gender-options">
                            <div className="seller-edit-profile__gender-option">
                                <input
                                    className="seller-edit-profile__radio custom-radio-indicator"
                                    type="radio"
                                    id="gender-male"
                                    name="gender"
                                    value={'male'}
                                />
                                <label htmlFor="gender-male">Nam</label>
                            </div>
                            <div className="seller-edit-profile__gender-option">
                                <input
                                    className="seller-edit-profile__radio custom-radio-indicator"
                                    type="radio"
                                    id="gender-female"
                                    name="gender"
                                    value={'female'}
                                />
                                <label htmlFor="gender-female">Nữ</label>
                            </div>
                        </div>
                    </div>
                    <div className="seller-edit-profile__row">
                        <label className="seller-edit-profile__label">Ngày sinh</label>
                        <div className="seller-edit-profile__birth-inputs">
                            <input className="seller-edit-profile__input" placeholder="Ngày" />
                            <input className="seller-edit-profile__input" placeholder="Tháng" />
                            <input className="seller-edit-profile__input" placeholder="Năm" />
                        </div>
                    </div>
                    <div className="seller-edit-profile__row">
                        <label className="seller-edit-profile__label">Email</label>
                        <input className="seller-edit-profile__input" type="email" />
                    </div>
                    <div className="seller-edit-profile__button-container">
                        <button className="seller-edit-profile__button">Cập nhật thông tin</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
