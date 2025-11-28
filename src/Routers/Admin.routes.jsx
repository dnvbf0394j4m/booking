// import Dashbroad from "../Pages/Admin/Dashbroad";
// import Layout from "../Component/Layout/index";

// import CreateHotel from "../Pages/Admin/Hotel/CreateHotel";
// import Login from "../Pages/Admin/Login";

// import Rooms from "../Pages/Admin/Room/Index";
// import Hotel from "../Pages/Admin/Hotel";
// import HotelList from "../Pages/Admin/Hotel/HotelList";
// import CheckoutPage from "../Pages/Admin/checkout/CheckoutPage";
// import PaymentResult from "../Pages/Admin/checkout/PaymentResult";
// import HotelDetail from "../Pages/Admin/Hotel/DetailHotel";
// import HotelTimeline from "../Pages/Admin/vidu";
// import Employee from "../Pages/Admin/Employee";
// import CreateEmployee from "../Pages/Admin/Employee/CreateEmlpoyee";
// import AdminDashboard from "../Pages/Admin/Dashbroad";

// export const AdminRoutes = [
//     {
//         path: "/Admin",
//         element: <Layout />,
//         children: [
//             {
//                 index: true,
//                 element: <AdminDashboard />,
//             },
//             {
//                 path: "Hotel",
//                 element: <Hotel />,
//                 children: [

//                     {
//                         index: true,
//                         element: <HotelList />

//                     },
//                     {
//                         path: "create",
//                         element: <CreateHotel />,
//                     },

//                     {
//                         path: "detail/:id",
//                         element: <HotelDetail />

//                     },
//                     {
//                         path: ":id/edit",
//                         element: <CreateHotel />,
//                     },
//                     {
//                         path: ":id/rooms",
//                         element: <Rooms />,
//                         children: [
//                             {

//                             }
//                         ]
//                     },
//                 ],
//             },
//             {
//                 path:"employee",
//                 element:<Employee/>,
//                 // children:[
//                 //     {
//                 //         path:"create",
//                 //         element:<CreateEmployee/>
//                 //     }
//                 // ]
//             }
//         ],
//     },
//     {
//         path: "/Admin/Login",
//         element: <Login />,
//     },
//     {
//         path: "checkout",
//         element: <CheckoutPage />
//     },
//     {
//         path: "payment/result",
//         element: <PaymentResult />
//     },
//     {
//         path:"/vidu",
//         element:<HotelTimeline/>
//     }


// ];




import RequireAuth from "../Component/Auth/RequireAuth";
import AdminDashboard from "../Pages/Admin/Dashbroad";
import Layout from "../Component/Layout/index";

import CreateHotel from "../Pages/Admin/Hotel/CreateHotel";
import Login from "../Pages/Admin/Login";

import Rooms from "../Pages/Admin/Room/Index";
import Hotel from "../Pages/Admin/Hotel";
import HotelList from "../Pages/Admin/Hotel/HotelList";
import CheckoutPage from "../Pages/Admin/checkout/CheckoutPage";
import PaymentResult from "../Pages/Admin/checkout/PaymentResult";
import HotelDetail from "../Pages/Admin/Hotel/DetailHotel";
import HotelTimeline from "../Pages/Admin/vidu";
import Employee from "../Pages/Admin/Employee";
import CreateEmployee from "../Pages/Admin/Employee/CreateEmlpoyee";

export const AdminRoutes = [
  {
    path: "/Admin",
    element: (
      <RequireAuth allowedRoles={["ADMIN", "ADMIN_HOTEL"]} />
    ),
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "Hotel",
            element: <Hotel />,
            children: [
              {
                index: true,
                element: <HotelList />,
              },
              {
                path: "create",
                element: <CreateHotel />,
              },
              {
                path: "detail/:id",
                element: <HotelDetail />,
              },
              {
                path: ":id/edit",
                element: <CreateHotel />,
              },
              {
                path: ":id/rooms",
                element: <Rooms />,
              },
            ],
          },
          {
            path: "employee",
            element: <Employee />,
          },
        ],
      },
    ],
  },
  {
    path: "/Admin/Login",
    element: <Login />,
  },
  {
    path: "/Admin/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/Admin/payment/result",
    element: <PaymentResult />,
  },
  {
    path: "/Admin/vidu",
    element: <HotelTimeline />,
  },
];
