import './profile.scss'
import defaultAvatar from '@/assets/default-avatar-icon.svg'

export const ProfilePage = () => {
    return (
        <>
            <div className='seller-profile-container'>
                <h1>Thông tin cá nhân</h1>
                <div className='seller-profile'>
                    <div className='seller-profile__main'>
                        <div className='avatar'>
                            <img src={defaultAvatar} alt="avatar" />
                        </div>
                        <div className="name <div className='hr'></div>">
                            <div className="label">Họ và tên</div>
                            <div>Tên nhân viên</div>
                        </div>
                        <div className='hr'></div>
                        <div className='phone'>
                            <div className='label'>Số điện thoại</div>
                            <div>0987249005</div>
                        </div>
                        <div className='hr'></div>
                        <div className='gender'>
                            <div className="label">Giới tính</div>
                            <div>Nam</div>
                        </div>
                        <div className='hr'></div>
                        <div className='button-container'>
                            <button>Chỉnh sửa thông tin</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}