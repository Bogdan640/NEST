import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Splash } from "./pages/Splash";
import { Register } from "./pages/Register";
import { Join } from "./pages/Join";
import { Pending } from "./pages/Pending";
import { Feed } from "./pages/Feed";
import { Events } from "./pages/Events";
import { Shed } from "./pages/Shed";
import { Parking } from "./pages/Parking";
import { Profile } from "./pages/Profile";
import { Admin } from "./pages/Admin";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  { path: "/", element: <Splash /> },
  { path: "/register", element: <Register /> },
  { path: "/join", element: <Join /> },
  { path: "/pending", element: <Pending /> },
  { path: "/app/feed", element: <Layout><Feed /></Layout> },
  { path: "/app/events", element: <Layout><Events /></Layout> },
  { path: "/app/shed", element: <Layout><Shed /></Layout> },
  { path: "/app/parking", element: <Layout><Parking /></Layout> },
  { path: "/app/profile", element: <Layout><Profile /></Layout> },
  { path: "/app/admin", element: <Layout><Admin /></Layout> },
  { path: "/app/settings", element: <Layout><Settings /></Layout> },
  { path: "*", element: <Navigate to="/" replace /> },
]);