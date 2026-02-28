import "./salesCard.css"
import React from "react"
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function SalesCard({ title, total, currency }) {
    return (
        <div className="salesCard">
            <div className="salesCardHeader">
                <h3>{title}</h3>
                <div className="salesIcon">
                    <TrendingUpIcon />
                </div>
            </div>
            <div className="salesCardContent">
                <p className="salesTotal">{currency}{total}</p>
                <span className="salesTrend">+12% from last month</span>
            </div>
        </div>
    )
}