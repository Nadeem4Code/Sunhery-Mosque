import React, { useRef, useEffect, useContext } from "react";
import Header from "./components/common/Header";
import Home from "./pages/home/Home";
import Footer from "./components/common/Footer";
// Login
import Login from "./pages/admin/Login";
import Register from "./pages/admin/Register";
import Reset from "./pages/admin/Reset";
import Dashboard from "./pages/admin/Dashboard";

// Users

import ShowUser from "./pages/users/ShowUser";
import UserContext from "./context/BooksContext";

// Components
import PrayerTimes from "./pages/mosque/PrayerTimes";
import Donate from "./pages/donate/Donate";

// UsersForPublic
import ShowUserPublic from "./pages/users/ShowUserPublic";

// UserForAdmin
import ShowUserForMosqueAdmin from "./pages/admin/UserForMosque/ShowUserForMosqueAdmin";

// Import Addamount
import AddAmount from "./pages/admin/UserForMosque/AddAmount";

// For imam
import ShowUserForImamAdmin from "./pages/admin/UserForImam/ShowUserForImamAdmin";
import AddAmountForImam from "./pages/admin/UserForImam/AddAmountForImam";

// React router
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { RouterProvider } from "react-router";
import UserDetails from "./pages/users/UserDetails";
import AddUser from "./pages/admin/AddUser";

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
            <Footer />
          </>
        }
      >
        <Route index element={<Home />} />
        <Route path="prayer" element={<PrayerTimes />} />

        <Route path="addUser" element={<AddUser />} />
        <Route path="showUser" element={<ShowUser />} />
        <Route path="showUserPublic" element={<ShowUserPublic />} />

        <Route path="/user/:id" element={<UserDetails />} />
        <Route path="donation" element={<Donate />} />
        <Route path="login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<Reset />} />
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
    )
  );

  const scrollInto = useRef(null);
  useEffect(() => {
    scrollInto.current.scrollIntoView();
  });
  return (
    <div ref={scrollInto}>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
