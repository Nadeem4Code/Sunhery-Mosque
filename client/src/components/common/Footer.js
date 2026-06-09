import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import { Stack } from "@mui/material";

// Icons
import home from "../../assets/icons/home.svg";
import homeColor from "../../assets/icons/homeColor.svg";
import userList from "../../assets/icons/userList.svg";
import userListColor from "../../assets/icons/userListColor.svg";
import login from "../../assets/icons/login.svg";
import loginColor from "../../assets/icons/loginColor.svg";
import donation from "../../assets/icons/donation.svg";
import donationColor from "../../assets/icons/donationColor.svg";

const Footer = () => {
  const location = useLocation();
  const [value, setValue] = React.useState(location.pathname);

  React.useEffect(() => {
    setValue(location.pathname);
  }, [location]);

  return (
    <Box sx={{ pb: 7 }}>
      <CssBaseline />

      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <style>{`
            @keyframes nav-pop {
              0% { transform: scale(1); }
              50% { transform: scale(1.2); }
              100% { transform: scale(1); }
            }
            .nav-active-pop {
              animation: nav-pop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            /* Remove blue/grey tap highlights and square outlines on click */
            .MuiBottomNavigation-root a,
            .MuiBottomNavigation-root button,
            .MuiBottomNavigation-root .MuiButtonBase-root {
              outline: none !important;
              box-shadow: none !important;
              -webkit-tap-highlight-color: transparent !important;
            }
          `}</style>
          <Stack direction="row" spacing={3}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NavLink to="/">
                <BottomNavigationAction
                  icon={
                    <img
                      src={value === "/" ? homeColor : home}
                      alt="Home Icon"
                      className={value === "/" ? "nav-active-pop" : ""}
                      style={{
                        width: "45px",
                        height: "45px",
                        marginTop: "10px",
                      }}
                    />
                  }
                />
              </NavLink>
            </div>
            {/*Donation*/}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NavLink to="/donation">
                <BottomNavigationAction
                  label="Favorites"
                  icon={
                    <img
                      src={value === "/donation" ? donationColor : donation}
                      alt="User List Icon"
                      className={value === "/donation" ? "nav-active-pop" : ""}
                      style={{
                        marginTop: "15px",
                        width: "50px",
                        height: "60px",
                      }}
                    />
                  }
                />
              </NavLink>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NavLink to="/showUserPublic">
                <BottomNavigationAction
                  label="Favorites"
                  icon={
                    <img
                      src={value === "/showUserPublic" ? userListColor : userList}
                      alt="User List Icon"
                      className={value === "/showUserPublic" ? "nav-active-pop" : ""}
                      style={{
                        width: "45px",
                        height: "35px",
                      }}
                    />
                  }
                />
              </NavLink>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NavLink to="/login">
                <BottomNavigationAction
                  label="Login"
                  icon={
                    <img
                      src={value === "/login" ? loginColor : login}
                      alt="Login Icon"
                      className={value === "/login" ? "nav-active-pop" : ""}
                      style={{
                        width: "25px",
                        height: "25px",
                      }}
                    />
                  }
                />
              </NavLink>
            </div>
          </Stack>
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Footer;
