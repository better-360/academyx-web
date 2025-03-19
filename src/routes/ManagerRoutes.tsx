import { Routes, Route } from "react-router-dom";
import ManagerDashboard from "../pages/manager/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import ManagerLayout from "../layouts/ManagerLayout";
import ManagerUsers from "../pages/manager/Users";
import Results from "../pages/manager/Results";
import ManagerAssessments from "../pages/manager/Assessments";
import ManagerAssessmentsDetails from "../pages/manager/AssessmentsDetails";
import Help from "../pages/manager/Help";
import ManagerSurveyReport from "../pages/manager/SurveyReport";
import ManagerAssessment from "../pages/manager/ManagerAssesment";
import Profile from "../pages/manager/Profile";
import Settings from "../pages/manager/Settings";

export default function ManagerRoutes() {
  return (
    <ProtectedRoute requiredRole="COMPANY_ADMIN">
<Routes>
        <Route element={<ManagerLayout />}>
          <Route path="/" element={<ManagerDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="assessments/:id" element={<ManagerAssessmentsDetails />} />
          <Route path="assessments" element={<ManagerAssessments />} />
          <Route path="manager-assessment/:id" element={<ManagerAssessment />} />
          <Route path="personnel" element={<ManagerUsers />} />
          <Route path="results" element={<Results />} />
          <Route path="results/:id/report" element={<ManagerSurveyReport />} />
          <Route path="help" element={<Help />} />
        </Route>
</Routes>
      </ProtectedRoute>
  );
}