import { Children } from "react";
import Layout from "../Component/Layout/index";

import BookingSchedule from "../Pages/Staff/BookingSchedule";

import RequireAuth from "../Component/Auth/RequireAuth";

export const staffRoutes = [
  {
    path: "/staff",
    element: (
      <RequireAuth allowedRoles={["ADMIN", "ADMINHOTEL", "STAFF"]} />
    ),
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <BookingSchedule />
          }
        ]
      }
    ]
  },
];
