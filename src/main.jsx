import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router";
import {router} from "../src/Routers/index.jsx"



createRoot(document.getElementById('root')).render(

  <RouterProvider router={router} />,
)
