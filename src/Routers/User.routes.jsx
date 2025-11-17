import { Children } from "react";
import Layout from "../Component/Layout";
import About from "../Pages/About"
import Home from "../Pages/Home"
import HotelDetail from "../Pages/Home/HotelDetail"
import HotelLayout from "../Component/Layout/HotelLayout";
import Login from "../Pages/auth/Login";
import Register from "../Pages/auth/Register";
import LayoutUser from "../Component/Layout";
import BookingPage from "../Pages/Booking/BookingPage";
import PaymentSuccess from "../Pages/Booking/PaymentSuccess";
import PaymentFail from "../Pages/Booking/PaymentFail";

export const userRoutes = [
    {
        path: "/",
        element: <LayoutUser />,
        children: [
            {
                index: true,
                element: <Home />,
            },

            {
                path: "Hotels/:id",
                element: <HotelDetail />,
            },
            {
                path: "Login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />
            },
            { path: "booking", element: <BookingPage /> },
            {
                path:"/payment/success",
                element:<PaymentSuccess />
            },
            {
                path:"/payment/fail",
                element:<PaymentFail />
            }
           



        ]



    },


];