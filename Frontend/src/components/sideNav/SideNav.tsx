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
import RentOrderIcon from '../imageComponents/RentOrderIcon';
import StocksIcon from '../imageComponents/StocksIcon';
import UsersIcon from '../imageComponents/UsersIcon';
import PaymentsIcon from '../imageComponents/PaymentsIcon';
import CashBookIcon from '../imageComponents/CashBookIcon';
import ReportsIcon from '../imageComponents/ReportsIcon';

export const sideBarConfig: SideBarConfig[] = [
  {
    title: 'Home',
    icon: <HomeIcon />,
    path: '/secured/dashboard',
  },
  {
    title: 'Rent Out',
    icon: <RentOrderIcon />,
    children: [
      {
        title: 'New Rent Order',
        path: '/secured/addRentOrder',
      },
      {
        title: 'Rent Book',
        path: '/secured/rentBook',
      },
      {
        title: 'Return Rent',
        path: '/secured/rentReturn',
      },
      {
        title: 'Add Rent Item',
        path: '/secured/addRentItem',
      },
    ],
  },
  {
    title: 'Sales',
    icon: <SaleOrderIcon />,
    children: [
      {
        title: 'New Sale Order',
        path: '/secured/addSalesOrder',
      },
      {
        title: 'Order Book',
        path: 'salesOrderBook',
      },
    ],
  },
  {
    title: 'Stock',
    icon: <StocksIcon />,
    path: '/secured/stock',
  },
  {
    title: 'Users',
    icon: <UsersIcon />,
    path: '/secured/users',
  },
  {
    title: 'Payments',
    icon: <PaymentsIcon />,
    path: '/secured/payments',
  },
  {
    title: 'Cash Book',
    icon: <CashBookIcon />,
    path: '/secured/cashBook',
  },
  {
    title: 'Reports',
    icon: <ReportsIcon />,
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
