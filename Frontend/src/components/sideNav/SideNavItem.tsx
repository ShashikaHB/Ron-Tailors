/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useState } from 'react';
import { FaAngleRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { SideBarConfig } from '../../types/common';

const SideNavItem: React.FC<SideBarConfig> = (item) => {
  const { children, icon, title, path } = item;
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  if (children) {
    return (
      <div className={open ? 'side-nav-item open' : 'side-nav-item'}>
        <div className="side-nav-title" onClick={handleClick} role="button" tabIndex={0}>
          <button type="button" className="side-nav-btn w-100" onClick={handleClick}>
            <span className="icon">{icon}</span>
            {title}
            <span className="arrow">
              <FaAngleRight />
            </span>
          </button>
        </div>
        <div className="side-nav-content">
          <ul>
            {children.map((element, index) => (
              <li key={index}>
                <SideNavItem {...element} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  return (
    <div className="sideNav-item">
      {path && (
        <Link to={path}>
          <button type="button" className="side-nav-btn w-100" onClick={handleClick}>
            <span className="icon">{icon}</span>
            {title}
          </button>
        </Link>
      )}
    </div>
  );
};

export default SideNavItem;
