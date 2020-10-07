import React from "react";
import { NavLink } from "react-router-dom";
import "./styles.css";
import { auth } from '../../firebase/firebase.util';

const Navbar = () => {
  return (
    <>
      <div className="container-fluid" style={{padding: '0px'}} >
        <nav className="navbar navbar-light navbar-expand-sm" id="nav_main">
            <div className="container-fluid row">
              <NavLink
                className="nav-link"
                to="/"
              >
                <p>Home</p>
              </NavLink>
              <NavLink
                to="/about"
              >
                <p>Về chúng tôi</p>
              </NavLink>
              {!auth.currentUser ? (
                <>
                  <NavLink className="nav-link" to="/login">
                    <p>Đăng nhập</p>
                  </NavLink>

                  <NavLink className="nav-link" to="/signup">
                    <p>Đăng ký</p>
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink className="nav-link" to="/dashboard">
                    <p>Quản lý</p>
                  </NavLink>
                  <NavLink className="nav-link" to="/profile">
                    <p>Thông tin cá nhân</p>
                  </NavLink>
                  <NavLink
                    className="nav-link"
                    to="/"
                    onClick={() => {
                      auth.signOut()
                    }}
                  >
                    <p>Đăng xuất</p>
                  </NavLink>
                </>
              )}
            </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;