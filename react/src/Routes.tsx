import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import TasksPage from "./pages/tasks/TasksPage";
import TasksStatistics from "./pages/tasks/TasksStatistics";
import MainLayout from "./layouts/MainLayout";

import AuthGuard from "./guards/AuthGuard";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route
            path="/tasks"
            element={
              <AuthGuard>
                <TasksPage />
              </AuthGuard>
            }
          />
          <Route
            path="/statistics"
            element={
              <AuthGuard>
                <TasksStatistics />
              </AuthGuard>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
