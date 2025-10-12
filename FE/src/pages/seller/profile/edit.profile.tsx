import './edit.profile.scss'
import defaultAvatar from '@/assets/seller/user.svg'

export const EditProfilePage = () => {
    return (
        <>
            <div className="seller-edit-profile">
                <h1 className='seller-edit-profile__title'>Thông tin cá nhân</h1>
                <div className="seller-edit-profile__card">
                    <div className="seller-edit-profile__main">
                        <div className="seller-edit-profile__avatar-container">
                            <img src={defaultAvatar} alt="avatar" className='seller-edit-profile__avatar' />
                        </div>
                        <div className="seller-edit-profile__row">
                            <div className="seller-edit-profile__label">Họ và tên</div>
                            <input className="seller-edit-profile__input"></input>
                        </div>
                        <div className="seller-edit-profile__row">
                            <div className="seller-edit-profile__label">Số điện thoại</div>
                            <input className="seller-edit-profile__input"></input>
                        </div>
                        <div className="seller-edit-profile__row seller-edit-profile__row-gender">
                            <div className="seller-edit-profile__label">Giới tính</div>
                            <div className='seller-edit-profile__input-gender-container'>
                                <input
                                    className="seller-edit-profile__input-male"
                                    type='radio'
                                    id='seller-edit-profile__input-male'
                                    name='gender'
                                    value={'male'}
                                />
                                <label htmlFor="seller-edit-profile__input-male">Nam</label>
                                <input
                                    className="seller-edit-profile__input-female"
                                    type='radio'
                                    id='seller-edit-profile__input-female'
                                    name='gender'
                                    value={'female'}
                                />
                                <label htmlFor="seller-edit-profile__input-female">Nữ</label>
                            </div>
                        </div>
                        <div className="seller-edit-profile__row">
                            <div className="seller-edit-profile__label">Ngày sinh</div>
                            <div className='seller-edit-profile__input-birth-container'>
                                <input className="seller-edit-profile__input-day"></input>
                                <input className="seller-edit-profile__input-month"></input>
                                <input className="seller-edit-profile__input-year"></input>
                            </div>
                        </div>
                        <div className="seller-edit-profile__row">
                            <div className="seller-edit-profile__label">Email</div>
                            <input className="seller-edit-profile__input"></input>
                        </div>
                        <div className="seller-edit-profile__button-container">
                            <button className="seller-edit-profile__button">Cập nhật thông tin</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}