import defaultAvatar from "@/assets/seller/user.svg";
import '@/pages/client/profile/edit.profile.scss'

export const EditProfileClient = () => {
    return (
        <div className="client-edit-profile">
            <h1 className='client-edit-profile__title'>Thông tin cá nhân</h1>
            <div className="client-edit-profile__card">
                <div className="client-edit-profile__main">
                    <div className="client-edit-profile__avatar-container">
                        <img src={defaultAvatar} alt="avatar" className='client-edit-profile__avatar' />
                    </div>
                    <div className="client-edit-profile__row">
                        <label className="client-edit-profile__label">Họ và tên</label>
                        <input className="client-edit-profile__input" />
                    </div>
                    <div className="client-edit-profile__row">
                        <label className="client-edit-profile__label">Số điện thoại</label>
                        <input className="client-edit-profile__input disabled" disabled value={'0123456789'} />
                    </div>
                    <div className="client-edit-profile__row">
                        <label className="client-edit-profile__label">Giới tính</label>
                        <div className='client-edit-profile__gender-options'>
                            <div className='client-edit-profile__gender-option'>
                                <input
                                    className="client-edit-profile__radio custom-radio-indicator"
                                    type='radio'
                                    id='gender-male'
                                    name='gender'
                                    value={'male'}
                                />
                                <label htmlFor="gender-male">Nam</label>
                            </div>
                            <div className='client-edit-profile__gender-option'>
                                <input
                                    className="client-edit-profile__radio custom-radio-indicator"
                                    type='radio'
                                    id='gender-female'
                                    name='gender'
                                    value={'female'}
                                />
                                <label htmlFor="gender-female">Nữ</label>
                            </div>
                        </div>
                    </div>
                    <div className="client-edit-profile__row">
                        <label className="client-edit-profile__label">Ngày sinh</label>
                        <div className='client-edit-profile__birth-inputs'>
                            <input className="client-edit-profile__input" placeholder='Ngày' />
                            <input className="client-edit-profile__input" placeholder='Tháng' />
                            <input className="client-edit-profile__input" placeholder='Năm' />
                        </div>
                    </div>
                    <div className="client-edit-profile__row">
                        <label className="client-edit-profile__label">Email</label>
                        <input className="client-edit-profile__input" type='email' />
                    </div>
                    <div className="client-edit-profile__button-container">
                        <button className="client-edit-profile__button">Cập nhật thông tin</button>
                    </div>
                </div>
            </div>
        </div>
    )
}