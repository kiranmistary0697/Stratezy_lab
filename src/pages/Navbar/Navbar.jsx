import React, { useState, useEffect, useRef } from "react";
import { Color, Icons, Images } from "../../constants/AppResource";
import "./Navbar.css"; // Import the CSS file
import { Link } from "react-router";

function Navbar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <main className="main-navbar bg-bgBlack">
      <div className="navbar-left">
        <p className="logo text-bgBlack bg-lightBlue font-bold p-2 w-[30px] h-[30px] flex items-center justify-center rounded-full">
          D
        </p>
        <p>StratezyLabs</p>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`sidebar ${isSidebarOpen ? "open" : ""} bg-bgBlack `}
      >
        <ul>
          <li>
            <Link className="flex gap-2" to={"/"}>
              <img
                src={Icons.HomeIcon}
                className="h-[20px] w-[20px] cursor-pointer"
              />
              <p className={`text-[14px] text-lightGray cursor-pointer`}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link to='/stocklist'>
            <div className="flex gap-2 items-center">
              <img
                src={Icons.GraphIcon}
                className="h-[20px] w-[20px] bg-bgBlack"
              />
              <p className="text-[14px] text-lightGray">Backtests</p>
              <img src={Icons.VectorDownIcon} className="h-[15px] w-[15px]" />
            </div>
            </Link>
          </li>
          <li>
            <Link to='/strategy'>
            <div className="flex gap-2 items-center">
              <img src={Icons.BoxIcon} className="h-[20px] w-[20px]" />
              <p className="text-[14px] text-lightGray">Deployments</p>
              <img src={Icons.VectorDownIcon} className="h-[15px] w-[15px]" />
            </div>
            </Link>
          </li>
          <li>
            <div className="flex gap-2">
              <img src={Icons.SettingIcon} className="h-[20px] w-[20px]" />
              <p className="text-[14px] text-lightGray">Advisory</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="flex gap-8 middleContainer">
        <Link to={"/"}>
          <div className="flex gap-2">
            <img src={Icons.HomeIcon} className="h-[20px] w-[20px]" />
            <p className={`text-[14px] text-lightGray`}>Dashboard</p>
          </div>
        </Link>
        <Link to='/stocklist'>
        <div className="flex gap-2 items-center">
          <img src={Icons.GraphIcon} className="h-[20px] w-[20px] bg-bgBlack" />
          <p className="text-[14px] text-lightGray">Backtests</p>
          <img src={Icons.VectorDownIcon} className="h-[15px] w-[15px]" />
        </div>
        </Link>
        <Link to='/strategy' >
        <div className="flex gap-2 items-center">
          <img src={Icons.BoxIcon} className="h-[20px] w-[20px]" />
          <p className="text-[14px] text-lightGray">Deployments</p>
          <img src={Icons.VectorDownIcon} className="h-[15px] w-[15px]" />
        </div>
        </Link>
        <div className="flex gap-2">
          <img src={Icons.SettingIcon} className="h-[20px] w-[20px]" />
          <p className="text-[14px] text-lightGray">Advisory</p>
        </div>
      </div>

      {/* Navbar Right Section for Large Screens */}
      <div className="navbar-right flex gap-3 items-center">
        <div>
          <img src={Icons.SunIcon} className="h-[20px] w-[20px]" />
        </div>
        <div>
          <img src={Icons.BingIcon} className="h-[20px] w-[20px]" />
        </div>
        <div>
          <img
            src={Images.ProfileImage}
            className="object-contain rounded-full h-[40px] w-[40px]"
          />
        </div>
        {/* Hamburger Menu for Mobile */}
        <div ref={hamburgerRef} className="hamburger" onClick={toggleSidebar}>
          &#9776;
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </main>
  );
}

export default Navbar;
