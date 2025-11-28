import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router";
import {router} from "../src/Routers/index.jsx"
import { AuthProvider } from "./context/useAuth"; 



createRoot(document.getElementById('root')).render(

  <AuthProvider>
  <RouterProvider router={router} />
  
  </AuthProvider>
)



// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// // import App from "./App.jsx"; // nếu dùng RouterProvider thì có thể không cần App
// import { RouterProvider } from "react-router"; // ⚠️ nên import từ react-router-dom
// import {router} from "../src/Routers/index.jsx"
// import { AuthProvider } from "./context/useAuth";  // 👈 import AuthProvider

// createRoot(document.getElementById("root")).render(
//   // <StrictMode>
//   //   <AuthProvider>
//       <RouterProvider router={router} />
//   //   </AuthProvider>
//   // </StrictMode>
// );
