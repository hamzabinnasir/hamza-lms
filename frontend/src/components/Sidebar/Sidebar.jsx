import "./sidebar.css"
import React from "react"
import { NavLink } from "react-router-dom"
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';

export default function Sidebar() {
    return (
        <>
            <ul className="adminSideBar">
                <NavLink className={({ isActive }) => isActive ? "link activeLink" : "link"} to={"/admin/dashboard"}>
                    <li>
                        <DashboardIcon className="sidebarIcon" />
                        <p>Dashboard</p>
                    </li>
                </NavLink>
                <NavLink className={({ isActive }) => isActive ? "link activeLink" : "link"} to={"/admin/courses"}>
                    <li>
                        <SchoolIcon className="sidebarIcon" />
                        <p>Courses</p>
                    </li>
                </NavLink>
            </ul>
        </>
    )
}