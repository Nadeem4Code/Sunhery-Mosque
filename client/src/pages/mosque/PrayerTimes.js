import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

// Card Import
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

// Images
import time1 from "../../assets/images/time1.jpg";

// List
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";

const PrayerTimes = () => {
  // Create a new Date object with the current date and time
  const date = new Date().toDateString();

  return (
    <>
      <Box sx={{ flexGrow: 1 }} style={{ marginTop: "24px" }}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <div style={{ marginLeft: "5px" }}>
                  <Grid container>
                    <Grid item xs={8} md={8}>
                      <Card style={{ boxShadow: "none" }}>
                        <CardContent>
                          <Typography
                            variant="h5"
                            style={{
                              color: "#252f6c",
                              fontWeight: 600,
                              marginBottom: "15px",
                            }}
                          >
                            Prayer Times
                          </Typography>
                          <Typography
                            variant="h6"
                            style={{
                              color: "#585a5b",
                              marginBottom: "10px",
                              fontWeight: 600,
                            }}
                          >
                            Prayer Times in India
                          </Typography>
                          <Typography
                            style={{ color: "#48BB78", fontWeight: "bold" }}
                          >
                            <u>{date}</u>
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={4} md={4}>
                      <Avatar
                        src={time1}
                        sx={{ boxShadow: 3 }}
                        variant="rounded"
                        style={{
                          height: "130px",
                          width: "130px",
                          marginTop: "20px",
                        }}
                      />
                    </Grid>
                  </Grid>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card style={{ boxShadow: "none" }}>
                  <CardContent>
                    <List component="nav" aria-label="main mailbox folders">
                      <ListItem
                        style={{
                          backgroundColor: "#9AE6B4",
                          borderRadius: "10px",
                          marginBottom: "5px",
                          color: "#48BB78",
                        }}
                      >
                        <ListItemText>
                          Fajar
                          <p
                            style={{
                              display: "inline",
                              position: "relative",
                              left: "200px",
                            }}
                          >
                            05 : 47
                          </p>
                        </ListItemText>
                      </ListItem>
                      <ListItem
                        style={{
                          backgroundColor: "#D6BCFA",
                          borderRadius: "10px",
                          marginBottom: "5px",
                          position: "relative",
                          left: "15px",
                          color: "#6B46C1",
                        }}
                      >
                        <ListItemText>
                          Zohar
                          <p
                            style={{
                              display: "inline",
                              position: "relative",
                              left: "200px",
                            }}
                          >
                            12 :34
                          </p>
                        </ListItemText>
                      </ListItem>
                      <ListItem
                        style={{
                          backgroundColor: "#b4edf8",
                          borderRadius: "10px",
                          marginBottom: "5px",
                          color: "#32b4b7",
                        }}
                      >
                        <ListItemText>
                          Asar
                          <p
                            style={{
                              display: "inline",
                              position: "relative",
                              left: "200px",
                            }}
                          >
                            03 : 35
                          </p>
                        </ListItemText>
                      </ListItem>
                      <ListItem
                        style={{
                          backgroundColor: "#9AE6B4",
                          borderRadius: "10px",
                          marginBottom: "5px",
                          position: "relative",
                          left: "15px",
                          color: "#48BB78",
                        }}
                      >
                        <ListItemText>
                          Maghrib
                          <p
                            style={{
                              display: "inline",
                              position: "relative",
                              left: "200px",
                            }}
                          >
                            05 :58
                          </p>
                        </ListItemText>
                      </ListItem>
                      <ListItem
                        style={{
                          backgroundColor: "#D6BCFA",
                          borderRadius: "10px",
                          color: "#6B46C1",
                        }}
                      >
                        <ListItemText>
                          Isha
                          <p
                            style={{
                              display: "inline",
                              position: "relative",
                              left: "210px",
                            }}
                          >
                            07 :15
                          </p>
                        </ListItemText>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};
export default PrayerTimes;
