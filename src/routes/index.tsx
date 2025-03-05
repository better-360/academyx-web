import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";
import UserLogin from "../pages/user/Login";
import AdminLogin from "../pages/admin/Login";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin/>} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/user/*" element={<UserRoutes />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/user/login" element={<UserLogin />} />
    </Routes>
  );
}
