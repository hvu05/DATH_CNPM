import { useNavigate } from "react-router-dom";
import "./profile.scss";
import defaultAvatar from "@/assets/default-avatar-icon.svg";

export const ProfilePage = () => {
  const navigate = useNavigate();
  return (
    <div className="seller-profile">
      <h1 className="seller-profile__title">Thông tin cá nhân</h1>
      <div className="seller-profile__card">
        <div className="seller-profile__main">
          <div className="seller-profile__avatar-container">
            <img
              className="seller-profile__avatar"
              src={defaultAvatar}
              alt="avatar"
            />
          </div>
          <div className="seller-profile__info-row">
            <div className="seller-profile__label">Họ và tên</div>
            <div className="seller-profile__value">Tên nhân viên</div>
          </div>
          <div className="seller-profile__hr"></div>
          <div className="seller-profile__info-row">
            <div className="seller-profile__label">Số điện thoại</div>
            <div className="seller-profile__value">0987249005</div>
          </div>
          <div className="seller-profile__hr"></div>
          <div className="seller-profile__info-row">
            <div className="seller-profile__label">Giới tính</div>
            <div className="seller-profile__value">Nam</div>
          </div>
          <div className="seller-profile__hr"></div>
          <div className="seller-profile__button-container">
            <button
              className="seller-profile__button"
              onClick={() => navigate("/seller/edit-profile")}
            >
              Chỉnh sửa thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
