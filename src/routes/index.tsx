import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";
import UserLogin from "../pages/user/Login";
import AdminLogin from "../pages/admin/Login";
import ManagerRoutes from "./ManagerRoutes";
import ManagerLogin from "../pages/manager/Login";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UserLogin/>} />
      <Route path="/user/*" element={<UserRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/manager/*" element={<ManagerRoutes />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/manager/login" element={<ManagerLogin/>} />
    </Routes>
  );
}
