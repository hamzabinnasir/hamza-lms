import "./dashboard.css"
import React, { useContext, useEffect, useState } from "react"
import LMScontext from "../../context/LMScontext"
import SalesCard from "../../components/SalesCard/SalesCard"
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import axios from "axios";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    const { currency, backendURL, token } = useContext(LMScontext);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalSales: 0,
        totalRevenue: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${backendURL}/api/dashboard/stats`, {
                    headers: { token }
                });
                if (response.data.success) {
                    setStats(response.data.stats);
                    setRecentActivity(response.data.recentActivity);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch dashboard data");
            }
        }
        if (token) {
            fetchStats();
        }
    }, [token, backendURL]);

    // Data for the chart
    const data = [
        { name: 'Users', value: stats.totalUsers },
        { name: 'Courses', value: stats.totalCourses },
        { name: 'Sales', value: stats.totalSales },
    ];

    return (
        <div className="dashboardPage">
            <div className="dashboardHeader">
                <div className="headerLeft">
                    <h1>Dashboard</h1>
                    <p>Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="headerRight">
                    <span className="dateDisplay">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            <div className="dashboardStats">
                <SalesCard title={"Total Sales"} total={stats.totalSales} icon={<SchoolIcon />} />
                <SalesCard title={"Total Revenue"} total={stats.totalRevenue} currency={currency} icon={<AttachMoneyIcon />} />
                <SalesCard title={"Active Users"} total={stats.totalUsers} icon={<PersonIcon />} />
            </div>

            <div className="dashboardGrid">
                <div className="dashboardSection chartSection">
                    <div className="sectionHeader">
                        <h2>Overview</h2>
                    </div>
                    <div className="chartContainer">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f5f5f5' }} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="dashboardSection">
                    <div className="sectionHeader">
                        <h2>Recent Activity</h2>
                    </div>
                    <div className="activityList">
                        {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                            <div key={index} className="activityItem">
                                <div className="activityIcon">
                                    <div className={`dot ${activity.type === 'course' ? 'green' : ''}`}></div>
                                </div>
                                <div className="activityContent">
                                    <p className="activityText">
                                        {activity.message}
                                    </p>
                                    <span className="time">{new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        )) : <p className="noActivity">No recent activity</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}