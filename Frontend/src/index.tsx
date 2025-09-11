import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import './tailwind.css';

import 'material-icons/iconfont/material-icons.css';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import NotFound from './Page/NotFound';
import Todos from "./Page/Todos";
import Login from "./Page/Login";
import NewUser from "./Page/NewUser";

const rootEl = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootEl);

const router = createBrowserRouter([
    { path: "/", element: <Todos/>, errorElement: <NotFound/> },
    { path: "/todos/new", element: <Todos/> },
    { path: "/NewSession", element: <Login/> },
    { path: "/NewUser", element: <NewUser/> },
]);

root.render(
    <Theme>
        <RouterProvider router={router} />
    </Theme>
);