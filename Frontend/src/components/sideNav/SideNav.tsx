/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
// import { MdDashboard } from "react-icons/md";
// import { FaAngleRight } from "react-icons/fa";
// import { Link } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SideNavItem from './SideNavItem';
import HomeIcon from '../imageComponents/HomeIcon';
import SaleOrderIcon from '../imageComponents/SalesOrderIcon';
import { SideBarConfig } from '../../types/common';

export const sideBarConfig: SideBarConfig[] = [
  {
    title: 'Home',
    icon: <HomeIcon />,
    path: '/secured/dashboard',
  },
  {
    title: 'Rent Out',
    icon: <HomeIcon />,
    children: [
      {
        title: 'New Rent Order',
        icon: <HomeIcon />,
        path: '/secured/addRentOrder',
      },
      {
        title: 'Rent Book',
        icon: <HomeIcon />,
        path: '/secured/rentBook',
      },
      {
        title: 'Return Rent',
        icon: <SaleOrderIcon />,
        path: '/secured/rentReturn',
      },
      {
        title: 'Add Rent Item',
        icon: <SaleOrderIcon />,
        path: '/secured/addRentItem',
      },
    ],
  },
  {
    title: 'Sales',
    icon: <SaleOrderIcon />,
    children: [
      {
        title: 'New Order',
        icon: <SaleOrderIcon />,
        path: '/secured/addSalesOrder',
      },
      {
        title: 'Order Book',
        path: 'salesOrderBook',
        icon: <HomeIcon />,
      },
    ],
  },
  {
    title: 'Stock',
    icon: <HomeIcon />,
    path: '/secured/stock',
  },
  {
    title: 'Users',
    icon: <HomeIcon />,
    path: '/secured/users',
  },
  {
    title: 'Payments',
    icon: <HomeIcon />,
    path: '/secured/payments',
  },
  {
    title: 'Cash Book',
    icon: <HomeIcon />,
    path: '/secured/cashBook',
  },
  {
    title: 'Reports',
    icon: <HomeIcon />,
    path: '/secured/reports',
  },
];

const SideNav = () => {
  return (
    <div className="sidebar">
      <Link className="primary-button w-100" to="/secured/newOrder">
        <button type="button" className="primary-button w-100">
          + New Order
        </button>
      </Link>
      <ul>
        {sideBarConfig.map((item, index) => (
          <li key={index}>
            <SideNavItem {...item} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideNav;
