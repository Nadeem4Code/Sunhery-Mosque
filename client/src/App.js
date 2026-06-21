import React, { useRef, useEffect, useContext, lazy, Suspense } from "react";
import { CircularProgress, Box } from "@mui/material";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { RouterProvider } from "react-router";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import AdminProtectedRoute from "./components/common/AdminProtectedRoute";
import UserContext from "./context/BooksContext";

// Lazy-load page components for route-based code splitting
const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/admin/Login"));
const Register = lazy(() => import("./pages/admin/Register"));
const Reset = lazy(() => import("./pages/admin/Reset"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ShowUser = lazy(() => import("./pages/users/ShowUser"));

const Donate = lazy(() => import("./pages/donate/Donate"));
const ShowUserPublic = lazy(() => import("./pages/users/ShowUserPublic"));
const ShowUserForMosqueAdmin = lazy(() => import("./pages/admin/UserForMosque/ShowUserForMosqueAdmin"));
const AddAmount = lazy(() => import("./pages/admin/UserForMosque/AddAmount"));
const ShowUserForImamAdmin = lazy(() => import("./pages/admin/UserForImam/ShowUserForImamAdmin"));
const AddAmountForImam = lazy(() => import("./pages/admin/UserForImam/AddAmountForImam"));
const UserDetails = lazy(() => import("./pages/users/UserDetails"));
const AddUser = lazy(() => import("./pages/admin/AddUser"));

const FooterPlaceholder = () => {
  return <Footer />;
};

const App = () => {
  const { fetchBooks } = useContext(UserContext);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={
          <>
            <Header />
            <FooterPlaceholder />
          </>
        }
      >
        <Route index element={<Home />} />
      
        <Route path="showUserPublic" element={<ShowUserPublic />} />
        <Route path="/user/:id" element={<UserDetails />} />
        <Route path="donation" element={<Donate />} />
        <Route path="login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<Reset />} />

        {/* Admin Protected Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="addUser" element={<AddUser />} />
          <Route path="showUser" element={<ShowUser />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/showUserForMosqueAdmin"
            element={<ShowUserForMosqueAdmin />}
          />
          <Route path="/addAmount/:id" element={<AddAmount />} />
          <Route
            path="/showUserForImamAdmin"
            element={<ShowUserForImamAdmin />}
          />
          <Route path="/addAmountForImam/:id" element={<AddAmountForImam />} />
        </Route>
      </Route>
    )
  );

  const scrollInto = useRef(null);
  useEffect(() => {
    scrollInto.current.scrollIntoView();
  });

  return (
    <div ref={scrollInto}>
      <Suspense fallback={
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh" }}>
          <CircularProgress color="secondary" />
        </Box>
      }>
        <RouterProvider router={router} />
      </Suspense>
    </div>
  );
};

export default App;
