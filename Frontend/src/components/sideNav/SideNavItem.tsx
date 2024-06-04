import React, { useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";
import { SideBarConfig } from "./SideNav";

const SideNavItem: React.FC<SideBarConfig> = (item) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  if (item.children) {
    return (
      <div className={open ? "sideNav-item open" : "sideNav-item"}>
        <div className="sideNav-title" onClick={handleClick}>
          <button className="side-nav-btn w-100" onClick={handleClick}>
            <span className="icon">
              <MdDashboard />
            </span>
            {item.title}
            <span className="arrow">
              <FaAngleRight />
            </span>
          </button>
        </div>
        <div className="sideNav-content">
          <ul>
            {item.children.map((item, index) => (
              <li key={index}>
                <SideNavItem {...item}></SideNavItem>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <div className="sideNav-item">
        {item.path && (
          <Link to={item.path}>
            <button className="side-nav-btn w-100" onClick={handleClick}>
              <span className="icon">
                <MdDashboard />
              </span>
              {item.title}
            </button>
          </Link>
        )}
      </div>
    );
  }
};

export default SideNavItem;
