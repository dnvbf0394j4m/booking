import { Children } from "react";
import Layout from "../Component/Layout";

import BookingSchedule from "../Pages/Staff/BookingSchedule";

export const staffRoutes = [
    {
        path: "/staff",
        element: <Layout />,
        children: [
            {
                index:true,
                element: <BookingSchedule />,
            },
            

        ]



    },


];