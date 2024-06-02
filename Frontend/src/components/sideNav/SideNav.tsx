import React from 'react'
// import { MdDashboard } from "react-icons/md";
// import { FaAngleRight } from "react-icons/fa";
// import { Link } from 'react-router-dom';
import SideNavItem from './SideNavItem';

export type SideBarConfig = {
    title: string,
    path?: string,
    icon?: string,
    children?:SideBarConfig []
}

export const sideBarConfig: SideBarConfig[] = [
    {
        title: "Dashboard",
        icon: 'bi-question-circle-fill',
        path: '/'
    },
    {
        title: "Profile",
        icon: 'bi-question-circle-fill',
        path: '/profile'
    },
    {
        title: "Sales",
        icon: 'bi-question-circle-fill',
        children: [{
            title:'Order Book',
            path: 'orderBook'
        },
        {
            title:'Sales',
            path: 'sales'
        }
    ]
    }
]



function SideNav() {
    return (

        // <div className='side-nav d-flex flex-column gap-1 overflow-y-auto mx-10'>
        //     <div className='side-nav-level-1 home active'>Home</div>
        //     <div className='side-nav-level-1 home'>Home</div>
        //     <div className='side-nav-level-1 home'>Home</div>
        //     <div className='side-nav-level-1 home'>Home</div>
        //     <div className='side-nav-level-1 home'>Home</div>
        //     <div className='side-nav-level-1 home'>Home</div>
        //     <div className='side-nav-level-1 home'>Home</div>
        //     <div className='side-nav-level-1 home'>Home</div>
        //     <div className='side-nav-level-1 home'>Home</div>
        //     <div className='side-nav-level-1 home'>Home</div>
        //     <div className='side-nav-level-1 home'>Home</div>
        //     <div className='side-nav-level-1 home'>Home</div>
        //     <div className='side-nav-level-1 home'>Home</div>
        // </div>

        // <>
        //     <div className="sidebar">
        //         <ul>
        //             <li>
        //                 <Link to='/'>
        //                 <button className='w-100'> 
        //                     <span className='icon'><MdDashboard/></span>
        //                     Dashboard
        //                     <span className='arrow'><FaAngleRight/></span>
        //                 </button>
        //                 </Link>
        //             </li>
        //             <li>
                        
        //                 <button className='w-100'> 
        //                     <span className='icon'><MdDashboard/></span>
        //                     Profile
        //                     <span className='arrow'><FaAngleRight/></span>
        //                 </button>
        //                 <div className="subMenuWrapper">
        //                 <ul className='subMenu'>
        //                     <li><Link to="#">Sub menu1</Link></li>
        //                     <li><Link to="#">Sub menu2</Link></li>
        //                     <li><Link to="#">Sub menu3</Link></li>
        //                 </ul>
        //                 </div>
        //             </li>
        //         </ul>
        //     </div>
        // </>

        <div className="sidebar">
            <ul>
                {sideBarConfig.map((item, index)=>  <li key={index}><SideNavItem {...item} ></SideNavItem></li> )}
           
            </ul>
        </div>
            )
}

export default SideNav