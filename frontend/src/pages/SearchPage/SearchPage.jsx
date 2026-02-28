import "./searchPage.css"
import React, { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import LMScontext from "../../context/LMScontext"
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Navbar from "../../components/Navbar/Navbar";

export default function SearchPage() {
    const { allCourses, currency } = useContext(LMScontext);
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q");
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState(query || "");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortBy, setSortBy] = useState("relevance");

    const categories = [
        "Next JS", "Data Science", "Frontend Development",
        "Fullstack Development", "MERN Stack Development",
        "Backend Development", "Javascript", "Python",
        "Docker", "MongoDB", "HTML"
    ];

    useEffect(() => {
        if (query) {
            setSearchQuery(query);
            const lowerQuery = query.toLowerCase();
            const results = allCourses.filter(course =>
                course.courseTitle.toLowerCase().includes(lowerQuery) ||
                course.category.toLowerCase().includes(lowerQuery)
            );
            setFilteredCourses(results);
        } else {
            setFilteredCourses(allCourses);
        }
    }, [query, allCourses]);

    useEffect(() => {
        if (selectedCategories.length > 0) {
            const results = allCourses.filter(course =>
                selectedCategories.includes(course.category)
            );
            setFilteredCourses(results);
        } else if (!query) {
            setFilteredCourses(allCourses);
        }
    }, [selectedCategories, allCourses, query]);

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    return (
        <>
            <Navbar />
            <div className="searchPage">
                <div className="searchPageContainer">
                    {/* Page Header */}
                    <div className="pageHeader">
                        <h1 className="pageTitle">E-Learning</h1>
                        {searchQuery && (
                            <div className="resultsInfo">
                                <span className="resultsCount">{filteredCourses.length} results for "{searchQuery}"</span>
                                <span className="showingText">Showing results for {searchQuery}</span>
                            </div>
                        )}
                    </div>

                    <div className="mainContentLayout">
                        {/* Sidebar */}
                        <aside className="searchSidebar">
                            <div className="filterBox">
                                <div className="filterHeader">
                                    <h2>Filter Options</h2>
                                </div>

                                {/* Sort Dropdown */}
                                <div className="sortSection">
                                    <h3>Sort by</h3>
                                    <div className="sortDropdown">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="sortSelect"
                                        >
                                            <option value="relevance">Relevance</option>
                                            <option value="popular">Most Popular</option>
                                            <option value="newest">Newest</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                        </select>
                                        <KeyboardArrowDownIcon className="dropdownIcon" />
                                    </div>
                                </div>

                                {/* Category Filter */}
                                <div className="categorySection">
                                    <h3>CATEGORY</h3>
                                    <div className="categoryList">
                                        {categories.map((cat, index) => (
                                            <label key={index} className="categoryCheckbox">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(cat)}
                                                    onChange={() => handleCategoryChange(cat)}
                                                />
                                                <span className="checkmark"></span>
                                                <span className="categoryLabel">{cat}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content - Course Grid */}
                        <main className="courseGridSection">
                            <div className="courseGrid">
                                {filteredCourses.length > 0 ? (
                                    filteredCourses.map((course, index) => (
                                        <div key={index} className="courseCard" onClick={() => navigate(`/course/${course._id}`)}>
                                            <div className="cardImageWrapper">
                                                <img src={course.courseThumbnail} alt={course.courseTitle} className="courseThumbnail" />
                                                <div className="levelBadge">{course.courseLevel || "Beginner"}</div>
                                            </div>
                                            <div className="cardContent">
                                                <h3 className="courseTitle">{course.courseTitle}</h3>
                                                <p className="courseDescription">
                                                    {course.courseDescription || "Learn comprehensive skills in this course"}
                                                </p>
                                                <div className="courseMeta">
                                                    <p className="courseInstructor">
                                                        <span className="instructorLabel">Instructor:</span> {course.creator?.name || "Instructor"}
                                                    </p>
                                                    <div className="coursePrice">
                                                        {course.coursePrice === 0 ? "Free" : `${currency}${course.coursePrice}`}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="noResults">
                                        <SearchIcon sx={{ fontSize: 48, color: '#666' }} />
                                        <h2>No courses found</h2>
                                        <p>Try adjusting your search or filters.</p>
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    )
}