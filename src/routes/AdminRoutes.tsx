import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import Companies from "../pages/admin/Companies";
import CompanyDetails from "../pages/admin/CompanyDetails";
import Courses from "../pages/admin/Courses";
import CourseEdit from "../pages/admin/CourseEdit";
import AssignAssessments from "../pages/admin/AssignAssessments";
import Results from "../pages/admin/Results";
import AdminUsers from "../pages/admin/Users";
import ProtectedRoute from "./ProtectedRoute";
import AssessmentsDetails from "../pages/admin/AssessmentsDetails";

export default function AdminRoutes() {
  return (
    <ProtectedRoute requiredRole="SYSADMIN">
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="companies" element={<Companies />} />
          <Route path="companies/:id" element={<CompanyDetails />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/new" element={<CourseEdit />} />
          <Route path="courses/:id/edit" element={<CourseEdit />} />
          <Route path="assignments" element={<AssignAssessments />} />
          <Route path="assignments/:id/details" element={<AssessmentsDetails />} />
          <Route path="results" element={<Results />} />
        </Route>
      </Routes>
    </ProtectedRoute>
  );
}