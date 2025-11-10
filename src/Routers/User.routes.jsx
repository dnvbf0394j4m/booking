import { Children } from "react";
import Layout from "../Component/Layout";
import About from "../Pages/About"
import Home from "../Pages/Home"

export const userRoutes = [
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index:true,
                element: <Home />,
            },
            {
                path: "/About",
                element: <About />,
            },

        ]



    },


];