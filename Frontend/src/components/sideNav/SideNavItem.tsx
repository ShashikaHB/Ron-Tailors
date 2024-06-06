import React, { useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { SideBarConfig } from "./SideNav";

const SideNavItem: React.FC<SideBarConfig> = (item) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  if (item.children) {
    return (
      <div className={open ? "side-nav-item open" : "side-nav-item"}>
        <div className="side-nav-title" onClick={handleClick}>
          <button className="side-nav-btn w-100" onClick={handleClick}>
            <span className="icon">{item.icon}</span>
            {item.title}
            <span className="arrow">
              <FaAngleRight />
            </span>
          </button>
        </div>
        <div className="side-nav-content">
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
              <span className="icon">{item.icon}</span>
              {item.title}
            </button>
          </Link>
        )}
      </div>
    );
  }
};

export default SideNavItem;
