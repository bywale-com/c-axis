import React from "react";
import { Outlet } from "react-router-dom";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";

/** Shell used on every route: Apex bar + page content + site footer */
export const RootLayout: React.FC = () => (
  <>
    <Nav />
    <main className="hq-route-main" id="main-content">
      <Outlet />
    </main>
    <Footer />
  </>
);
