import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Practice from "./pages/Practice.jsx";
import Meetings from "./pages/Meetings.jsx";
import Quizzes from "./pages/Quizzes.jsx";
import Explore from "./pages/Explore.jsx";
import SkillDetails from "./pages/SkillDetails.jsx";
import TutorProfile from "./pages/TutorProfile.jsx";
import Connections from "./pages/Connections.jsx";
import Messages from "./pages/Messages.jsx";
import NotFound from "./pages/NotFound.jsx";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="explore" element={<Explore />} />
        <Route path="skills/:skillName" element={<SkillDetails />} />
        <Route path="tutors/:email" element={<TutorProfile />} />
        <Route path="connections" element={<Connections />} />
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:email" element={<Messages />} />
        <Route path="profile" element={<Profile />} />
        <Route path="practice" element={<Practice />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="quizzes" element={<Quizzes />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
