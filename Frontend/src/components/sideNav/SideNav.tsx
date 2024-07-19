import { ReactElement } from "react";
// import { MdDashboard } from "react-icons/md";
// import { FaAngleRight } from "react-icons/fa";
// import { Link } from 'react-router-dom';
import SideNavItem from "./SideNavItem";
import { Link } from "react-router-dom";
import HomeIcon from "../imageComponents/HomeIcon";
import SaleOrderIcon from "../imageComponents/SalesOrderIcon";

export type SideBarConfig = {
  title: string;
  path?: string;
  icon?: ReactElement;
  children?: SideBarConfig[];
};

export const sideBarConfig: SideBarConfig[] = [
  {
    title: "Home",
    icon: <HomeIcon />,
    path: "/secured/dashboard",
  },
  {
    title: "Rent out",
    icon: <HomeIcon />,
    path: "/secured/profile",
  },
  {
    title: "Sales Order",
    icon: <SaleOrderIcon />,
    children: [
      {
        title: "Order Book",
        icon: <HomeIcon />,

        path: "/secured/orderBook",
      },
      {
        title: "Sales",
        icon: <SaleOrderIcon />,
        path: "/secured/sales",
      },
    ],
  },
  {
    title: "Payments",
    icon: <HomeIcon />,
    path: "/secured/payments",
  },
  {
    title: "Cash Book",
    icon: <HomeIcon />,
    path: "/secured/cashBook",
  },
  {
    title: "Stock",
    icon: <HomeIcon />,
    path: "/secured/stock",
  },
  {
    title: "Users",
    icon: <HomeIcon />,
    path: "/secured/users",
  },
  {
    title: "Reports",
    icon: <HomeIcon />,
    path: "/secured/reports",
  },
];

function SideNav() {
  return (
    <div className="sidebar">
      <Link className="primary-button w-100" to="/secured/newOrder">
        <button className="primary-button w-100">+ New Order</button>
      </Link>
      <ul>
        {sideBarConfig.map((item, index) => (
          <li key={index}>
            <SideNavItem {...item}></SideNavItem>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideNav;
