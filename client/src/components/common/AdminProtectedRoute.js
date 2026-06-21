import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

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

    const isAdminEmail = user.email === "7457861116@jama-masjid.com";

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
              if (isAdminEmail && (data.role !== "admin" || data.userName !== "Mohd Nadeem")) {
                axios.put(`http://localhost:3001/books/${data.id}`, {
                  ...data,
                  userName: "Mohd Nadeem",
                  role: "admin",
                  phoneNumber: "7457861116"
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
        if (isAdminEmail && (data.role !== "admin" || data.userName !== "Mohd Nadeem")) {
          setIsAdmin(true);
          axios.put(`http://localhost:3001/books/${data.id}`, {
            ...data,
            userName: "Mohd Nadeem",
            role: "admin",
            phoneNumber: "7457861116"
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminProtectedRoute;
