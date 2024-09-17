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
import { useAppSelector } from '../../redux/reduxHooks/reduxHooks';
import { selectUser } from '../../redux/features/auth/authSlice';

export const sideBarConfig: SideBarConfig[] = [
  {
    title: 'Home',
    icon: <HomeIcon />,
    path: '/secured/dashboard',
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
        title: 'Rent Items',
        path: '/secured/addRentItem',
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
    children: [
      {
        title: 'Users',
        path: '/secured/users',
      },
      {
        title: 'Monthly summary',
        path: '/secured/monthlySummary',
      },
    ],
  },
  {
    title: 'Salary',
    icon: <PaymentsIcon />,
    children: [
      {
        title: 'Salary',
        path: '/secured/editSalary',
      },
      {
        title: 'Piece Prices',
        path: '/secured/editPiecePrices',
      },
    ],
  },
  {
    title: 'Financial',
    icon: <CashBookIcon />,
    children: [
      {
        title: 'Cash Book',
        path: '/secured/cashBook',
      },
      {
        title: 'Accounts',
        path: '/secured/accounts',
      },
      {
        title: 'Day End',
        path: '/secured/dailySummary',
      },
    ],
  },
  {
    title: 'Payments',
    icon: <PaymentsIcon />,
    children: [
      {
        title: 'Sales/ Rent Order',
        path: '/secured/salesOrRentOrderPayment',
      },
      {
        title: 'Ready Made',
        path: '/secured/newReadyMadeOrder',
      },
    ],
  },
  {
    title: 'Reports',
    icon: <ReportsIcon />,
    path: '/secured/reports',
  },
];

const SideNav = () => {
  const user = useAppSelector(selectUser); // Select the logged-in user

  // Filter sidebar items for admins only
  const filteredSideBarConfig = sideBarConfig.filter((item) => {
    // For items like 'Users' or 'Salary' that are for Admins, we check the user's role
    if (item.title === 'Users' || item.title === 'Salary') {
      return user?.role === 'Admin'; // Only admins should see these items
    }
    return true; // Show all other items to all users
  });

  return (
    <div className="sidebar">
      <Link className="primary-button w-100" to="/secured/newOrder">
        <button type="button" className="primary-button w-100">
          + New Order
        </button>
      </Link>
      <ul>
        {filteredSideBarConfig.map((item, index) => (
          <li key={index}>
            <SideNavItem {...item} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideNav;
