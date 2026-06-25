import React, { useRef, useEffect, useContext, lazy, Suspense } from "react";
import { CircularProgress, Box, Grid, Card, Skeleton } from "@mui/material";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { RouterProvider } from "react-router";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import AdminProtectedRoute from "./components/common/AdminProtectedRoute";
import AdminDashboardLayout from "./components/common/AdminDashboardLayout";
import UserContext from "./context/BooksContext";
import ErrorPage from "./pages/error/ErrorPage";

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

const WebsiteSkeleton = () => {
  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#f8f9ff" }}>
      {/* Header Shell */}
      <Box sx={{ height: 64, bgcolor: "#ffffff", borderBottom: "1px solid #bfc8c8", px: 3, display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={120} height={24} />
        </Box>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="text" width={60} height={20} />
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ p: 4, maxWidth: 1200, margin: "0 auto", boxSizing: "border-box" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: "12px", mb: 4 }} />
            <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: "12px" }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, borderRadius: "12px", border: "1px solid #bfc8c8", boxShadow: "none" }}>
              <Skeleton variant="text" width="60%" height={24} sx={{ mb: 3 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} variant="rectangular" height={40} sx={{ borderRadius: "8px" }} />
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Footer Outline */}
      <Box sx={{ height: 120, bgcolor: "#eff1f3", mt: 8, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 1, boxSizing: "border-box" }}>
        <Skeleton variant="text" width={200} height={16} />
        <Skeleton variant="text" width={150} height={16} />
      </Box>
    </Box>
  );
};

const App = () => {
  const { fetchBooks } = useContext(UserContext);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" errorElement={<ErrorPage />}>
        {/* Public Routes - Wrapped with Header & Footer */}
        <Route
          element={
            <>
              <Header />
              <FooterPlaceholder />
            </>
          }
        >
          <Route index element={<Home />} />
          <Route path="showUserPublic" element={<ShowUserPublic />} />
          <Route path="user/:id" element={<UserDetails />} />
          <Route path="donation" element={<Donate />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="reset" element={<Reset />} />
        </Route>

        {/* Admin Routes - Wrapped with Admin Dashboard Layout Frame (No public Header/Footer) */}
        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminDashboardLayout />}>
            <Route path="addUser" element={<AddUser />} />
            <Route path="showUser" element={<ShowUser />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="showUserForMosqueAdmin" element={<ShowUserForMosqueAdmin />} />
            <Route path="addAmount/:id" element={<AddAmount />} />
            <Route path="showUserForImamAdmin" element={<ShowUserForImamAdmin />} />
            <Route path="addAmountForImam/:id" element={<AddAmountForImam />} />
          </Route>
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
      <Suspense fallback={<WebsiteSkeleton />}>
        <RouterProvider router={router} />
      </Suspense>
    </div>
  );
};

export default App;
