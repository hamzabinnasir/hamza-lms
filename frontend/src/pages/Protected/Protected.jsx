import React, { useContext } from "react"
import { Outlet, Navigate } from "react-router-dom"
import LMScontext from "../../context/LMScontext"
export default function Protected() {
    const { token } = useContext(LMScontext);
    return token ? <Outlet /> : <Navigate to={"/login"} replace />
}