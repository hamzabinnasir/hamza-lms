import "./home.css"
import React from "react"
import Navbar from "../../components/Navbar/Navbar"
import Hero from "../../components/Hero/Hero"
import Courses from "../../components/Courses/Courses"
export default function Home() {
    return (
        <>
            <div className="homeContainer">
                <Navbar />
                <Hero />
                <Courses />
            </div>
        </>
    )
}