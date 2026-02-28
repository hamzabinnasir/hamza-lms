import courseModel from "../models/courseModel.js";
import userModel from "../models/userModel.js";

export const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Users (excluding admins if necessary, but usually total registered users)
        const totalUsers = await userModel.countDocuments({ role: "student" });

        // 2. Total Courses
        const totalCourses = await courseModel.countDocuments({});

        // 3. Total Sales (Total Enrollments) & Total Revenue
        const courses = await courseModel.find({});
        let totalSales = 0;
        let totalRevenue = 0;

        courses.forEach(course => {
            const enrollments = course.enrolledStudent ? course.enrolledStudent.length : 0;
            totalSales += enrollments;
            totalRevenue += (course.coursePrice || 0) * enrollments;
        });

        // 4. Recent Activity (New Users & New Courses)
        // Fetch last 5 users
        const recentUsers = await userModel.find({ role: "student" })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("name createdAt");

        // Fetch last 5 courses
        const recentCourses = await courseModel.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select("courseTitle createdAt creator");

        // Combine and sort by date for a unified activity feed
        const activity = [
            ...recentUsers.map(u => ({
                type: "user",
                message: `New User Registered: ${u.name}`,
                date: u.createdAt
            })),
            ...recentCourses.map(c => ({
                type: "course",
                message: `New Course Created: ${c.courseTitle}`,
                date: c.createdAt
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalCourses,
                totalSales,
                totalRevenue
            },
            recentActivity: activity
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
    }
}
