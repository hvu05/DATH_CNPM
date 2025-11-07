import "./index.scss";

// BEGIN import image
import AddressImage from "@/assets/client/tab/address.svg";
import ClientAvtImage from "@/assets/client/tab/client-avt.svg";
// import HistoryImage from '@/assets/client/tab/history.svg'
import LogoutImage from "@/assets/client/tab/logout.svg";
import MyOrderImage from "@/assets/client/tab/myorder.svg";
import { useLocation, useNavigate } from "react-router-dom";

// End import Image
type PathName = "orders" | "history" | "address" | "profile" | "client";
export const TabClient = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActiveLink = (path: PathName): boolean => {
    if (path === "client") {
      return (
        location.pathname.slice(1) === path ||
        location.pathname.includes("profile")
      );
    }
    return location.pathname.includes(path);
  };
  return (
    <>
      <div className="client-tab-container">
        <ul>
          <li
            className={`${isActiveLink("client") ? "tab--active" : ""}`}
            onClick={() => navigate("/client")}
          >
            <span>
              <img src={ClientAvtImage} alt="client avt logo" />
            </span>
            <span>Xem hồ sơ</span>
          </li>
          <li
            className={`${isActiveLink("orders") ? "tab--active" : ""}`}
            onClick={() => navigate("/client/my-orders")}
          >
            <span>
              <img src={MyOrderImage} alt="client orders logo" />
            </span>
            <span>Đơn hàng của tôi</span>
          </li>
          {/*<li className={`${isActiveLink('history') ? 'tab--active' : ''}`}*/}
          {/*    onClick={() => navigate('/client/history')}>*/}
          {/*    <span>*/}
          {/*        <img src={HistoryImage} alt="client history logo"/>*/}
          {/*    </span>*/}
          {/*    <span>Lịch sử đặt hàng</span>*/}
          {/*</li>*/}
          <li
            className={`${isActiveLink("address") ? "tab--active" : ""}`}
            onClick={() => navigate("/client/address")}
          >
            <span>
              <img src={AddressImage} alt="client address logo" />
            </span>
            <span>Địa chỉ nhận hàng</span>
          </li>
          <li>
            <span>
              <img src={LogoutImage} alt="client logout logo" />
            </span>
            <span>Đăng xuất</span>
          </li>
        </ul>
      </div>
    </>
  );
};
