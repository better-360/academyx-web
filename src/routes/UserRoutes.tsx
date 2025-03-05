import { Route, Routes } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import TakeAssessment from "../pages/user/TakeAssessment";
import UserDashboard from "../pages/user/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

export default function UserRoutes() {
  return (
    <ProtectedRoute>
    <Routes>
      <Route path="/" element={<UserDashboard />} />
      <Route path="/user" element={<UserLayout />}>
      <Route path="assessment/:id" element={<TakeAssessment />} />
      </Route>
      </Routes>
    </ProtectedRoute>
  );
}
