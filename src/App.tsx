import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import ApproachPage from "./pages/ApproachPage";
import TeamPage from "./pages/TeamPage";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
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
