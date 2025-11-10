import { AdminRoutes } from "./Admin.routes";
import { staffRoutes } from "./Staff.routes";
import { userRoutes } from "./User.routes";
import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router";

const routes=[...AdminRoutes,...userRoutes,...staffRoutes]

export const router = createBrowserRouter(routes);