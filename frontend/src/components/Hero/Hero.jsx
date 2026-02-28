import "./hero.css"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import SearchIcon from '@mui/icons-material/Search';

export default function Hero() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery.trim()}`);
        }
    };

    const handleExplore = () => {
        navigate("/search");
    };

    return (
        <div className="heroSection">
            <div className="heroContainer">
                <h1>Find the Best Courses for You</h1>
                <p>Discover, learn and upskill with our wide range of courses taught by expert instructors.</p>
                <div className="searchBarContainer">
                    <div className="searchInputWrapper">
                        <SearchIcon className="searchIcon" />
                        <input
                            type="text"
                            placeholder="What do you want to learn?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <button id="searchBtn" className="btnType1" onClick={handleSearch}>Search</button>
                </div>
                <button id="exploreBtn" className="btnType2" onClick={handleExplore}>Explore Courses</button>
            </div>
        </div>
    )
}