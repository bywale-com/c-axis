import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import ApproachPage from "./pages/ApproachPage";
import TeamPage from "./pages/TeamPage";
import AssessmentPage from "./pages/AssessmentPage";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Standalone — own nav, no global shell */}
        <Route path="assessment" element={<AssessmentPage />} />
        {/* Global shell */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="approach" element={<ApproachPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
