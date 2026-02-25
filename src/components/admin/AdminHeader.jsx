import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutF } from "../../store/slice/inputSlice";
import { useNavigate } from "react-router-dom";
const AdminHeader = ({ isMobile, onToggle }) => {
  const user = useSelector((state) => state.input.user);

  const dispatch = useDispatch();

  const logoutFn = () => {
    dispatch(logoutF());
    alert("로그아웃 되었습니다");
  };

  return (
    <div className="adminHeader">
      <div className="adminHeader-con">
        <ul>
          {isMobile && (
            <li>
              <img
                src="/images/icon_menu_w.svg"
                alt="adminHeader-hidden"
                className="adminHeader-hidden"
                onClick={onToggle}
              />
            </li>
          )}
          <li>
            <h1>{user?.userName}님</h1>
          </li>
          <li>
            <button onClick={logoutFn}>로그아웃</button>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default AdminHeader;
