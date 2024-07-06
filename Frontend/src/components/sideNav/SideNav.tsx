import { ReactElement } from "react";
// import { MdDashboard } from "react-icons/md";
// import { FaAngleRight } from "react-icons/fa";
// import { Link } from 'react-router-dom';
import SideNavItem from "./SideNavItem";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";

export type SideBarConfig = {
  title: string;
  path?: string;
  icon?: ReactElement;
  children?: SideBarConfig[];
};

export const sideBarConfig: SideBarConfig[] = [
  {
    title: "Home",
    icon: <MdDashboard />,
    path: "/secured/dashboard",
  },
  {
    title: "Rent out",
    icon: <MdDashboard />,
    path: "/secured/profile",
  },
  {
    title: "Sales Order",
    icon: <MdDashboard />,
    children: [
      {
        title: "Order Book",
        icon: <MdDashboard />,

        path: "/secured/orderBook",
      },
      {
        title: "Sales",
        icon: <MdDashboard />,
        path: "/secured/sales",
      },
    ],
  },
  {
    title: "Payments",
    icon: <MdDashboard />,
    path: "/secured/payments",
  },
  {
    title: "Cash Book",
    icon: <MdDashboard />,
    path: "/secured/cashBook",
  },
  {
    title: "Stock",
    icon: <MdDashboard />,
    path: "/secured/stock",
  },
  {
    title: "Users",
    icon: <MdDashboard />,
    path: "/secured/users",
  },
  {
    title: "Reports",
    icon: <MdDashboard />,
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
