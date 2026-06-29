import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";

const AdminProtectedRoute = () => {
  const [user, loading] = useAuthState(auth);
  const [checkingRole, setCheckingRole] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => {
    const saved = localStorage.getItem("mongoUser");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        return u.role === "admin";
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setIsAdmin(false);
      setCheckingRole(false);
      localStorage.removeItem("mongoUser");
      return;
    }

    const isAdminEmail = user.email === process.env.REACT_APP_SUPER_ADMIN_EMAIL;

    // Check local storage for quick bypass
    const saved = localStorage.getItem("mongoUser");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.uid === user.uid && (u.role === "admin" || isAdminEmail)) {
          setIsAdmin(true);
          setCheckingRole(false);
          
          // Background sync to ensure role hasn't changed / promote admin
          axios.get(`http://localhost:3001/books/uid/${user.uid}`)
            .then((res) => {
              let data = res.data;
              if (isAdminEmail && (data.role !== "admin" || data.userName !== process.env.REACT_APP_SUPER_ADMIN_NAME)) {
                axios.put(`http://localhost:3001/books/${data.id}`, {
                  ...data,
                  userName: process.env.REACT_APP_SUPER_ADMIN_NAME,
                  role: "admin",
                  phoneNumber: process.env.REACT_APP_SUPER_ADMIN_PHONE
                }).then((putRes) => {
                  localStorage.setItem("mongoUser", JSON.stringify(putRes.data));
                });
              } else {
                localStorage.setItem("mongoUser", JSON.stringify(data));
                if (data.role !== "admin" && !isAdminEmail) {
                  setIsAdmin(false);
                }
              }
            })
            .catch((err) => {
              console.error("AdminProtectedRoute background sync failed:", err);
            });
          return;
        }
      } catch (e) {
        // Fall back to API fetch
      }
    }

    // Check backend MongoDB user role
    axios
      .get(`http://localhost:3001/books/uid/${user.uid}`)
      .then((res) => {
        let data = res.data;
        if (isAdminEmail && (data.role !== "admin" || data.userName !== process.env.REACT_APP_SUPER_ADMIN_NAME)) {
          setIsAdmin(true);
          axios.put(`http://localhost:3001/books/${data.id}`, {
            ...data,
            userName: process.env.REACT_APP_SUPER_ADMIN_NAME,
            role: "admin",
            phoneNumber: process.env.REACT_APP_SUPER_ADMIN_PHONE
          }).then((putRes) => {
            localStorage.setItem("mongoUser", JSON.stringify(putRes.data));
          });
        } else if (data && (data.role === "admin" || isAdminEmail)) {
          setIsAdmin(true);
          localStorage.setItem("mongoUser", JSON.stringify(data));
        } else {
          setIsAdmin(false);
          localStorage.removeItem("mongoUser");
        }
      })
      .catch((err) => {
        console.error("AdminProtectedRoute: Error checking role:", err);
        if (isAdminEmail) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      })
      .finally(() => {
        setCheckingRole(false);
      });
  }, [user, loading]);

  if (loading || checkingRole) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8f9ff" }}>
        {/* Sidebar shell skeleton */}
        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            width: 256,
            bgcolor: "#ffffff",
            borderRight: "1px solid #bfc8c8",
            p: 3,
            boxSizing: "border-box",
          }}
        >
          <Skeleton variant="rectangular" width="80%" height={40} sx={{ mb: 5, borderRadius: "8px" }} />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rectangular" height={45} sx={{ mb: 2, borderRadius: "8px" }} />
          ))}
        </Box>
        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, p: 4, boxSizing: "border-box" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, height: 64 }}>
            <Skeleton variant="text" width="30%" height={40} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: "12px" }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Skeleton variant="rectangular" height={250} sx={{ borderRadius: "12px" }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton variant="rectangular" height={250} sx={{ borderRadius: "12px" }} />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    );
  }

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminProtectedRoute;
