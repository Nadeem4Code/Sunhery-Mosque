import React, { useState, useEffect } from "react";

import { getAllTasks, updateTask, deleteTask } from "../../config/firebase";

import CircularProgress from "@mui/material/CircularProgress";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";

import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Slide from "@mui/material/Slide";

// Search
import SearchSecond from '../../assets/icons/searchSecond.svg'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ShowUser() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [open, setOpen] = useState(false); // State for controlling the dialog
  const [query, setQuery] = useState("");

  useEffect(() => {
    getAllTasks()
      .then((taskList) => {
        setTasks(taskList);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      });
  }, []);

  const handleEditClick = (taskId) => {
    setEditingTask(taskId);
    setOpen(true); // Open the dialog when "Edit" is clicked
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      await updateTask(taskId, updatedData);
      setEditingTask(null);

      const updatedTaskList = await getAllTasks();
      setTasks(updatedTaskList);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);

      const updatedTaskList = await getAllTasks();
      setTasks(updatedTaskList);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="success" />
      </div>
    );
  }
  const handleQuery = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div>
      {tasks.length === 0 ? (
        <p>No Users available.</p>
      ) : (
        <Card style={{ marginTop: "100px", boxShadow: "none" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: "10px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "220px",
                borderRadius: "5px",
                paddingRight: "5px",
                padding: "3px",
                boxShadow:
                  "0 5px 5px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <span
                style={{
                  padding: "5px",
                  marginTop: "5px",
                  borderRadius: "0 10px 10px 0",
                  cursor: "pointer",
                  paddingLeft: "20px",
                }}
              >
                <img src={SearchSecond} alt="search" />
              </span>
              <input
                type="text"
                value={query}
                onChange={handleQuery}
                style={{
                  padding: "5px",
                  flex: 1,
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  fontSize: "16px",
                  fontFamily: "Poppins",
                  width: "90px",
                }}
                placeholder="Search..."
              />
            </div>
          </div>
          <Card>
            <CardContent>
              <Typography
                style={{
                  color: "grey",
                  fontFamily: "Poppins",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                Users
              </Typography>
              <Grid container spacing={2}>
                {tasks
                  .filter((post) => {
                    if (query === "") {
                      return true;
                    } else if (
                      post.userName.toLowerCase().includes(query.toLowerCase())
                    ) {
                      return true;
                    } else if (
                      post.fatherName
                        .toLowerCase()
                        .includes(query.toLowerCase())
                    ) {
                      return true;
                    } else if (
                      post.phoneNumber
                        .toLowerCase()
                        .includes(query.toLowerCase())
                    ) {
                      return true;
                    }
                    return false;
                  })
                  .map((task, index) => (
                    <Grid key={task.id} item xs={12} md={6} sm={12}>
                      {editingTask === task.id ? (
                        <TaskEditForm
                          task={task}
                          onSave={(updatedData) =>
                            handleUpdateTask(task.id, updatedData)
                          }
                          open={open}
                          setOpen={setOpen}
                        />
                      ) : (
                        <>
                          <Box sx={{ width: "100%" }}>
                            <nav aria-label="main mailbox folders">
                              <List>
                                <ListItem disablePadding>
                                  <ListItemIcon>
                                    <Avatar
                                      disablePadding
                                      variant="circular"
                                      style={{
                                        color: "white",
                                        fontFamily: "Poppins",
                                        fontWeight: "600",
                                        fontSize: "30px",
                                        width: "50px",
                                        height: "50px",
                                        marginRight: "10px",
                                        background: `linear-gradient(135deg, #DF98FA 0%, #9055FF 100%)`,
                                      }}
                                    >
                                      {task.userName.slice(0, 1).toUpperCase()}
                                    </Avatar>
                                  </ListItemIcon>
                                  <ListItemText disablePadding>
                                    <Typography
                                      style={{
                                        fontSize: "18px",
                                        fontFamily: "Poppins",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {task.userName}
                                    </Typography>
                                    <Typography
                                      style={{
                                        fontSize: "14px",
                                        fontFamily: "Poppins",
                                        fontWeight: "500",
                                        color: "#8789A3",
                                      }}
                                    >
                                      {task.fatherName}
                                    </Typography>
                                    <Typography
                                      style={{
                                        color: "#8789A3",
                                        fontSize: "14px",
                                        fontWeight: "500",

                                        fontFamily: "Poppins",
                                      }}
                                    >
                                      {task.phoneNumber}
                                    </Typography>
                                  </ListItemText>

                                  <div
                                    style={{
                                      display: "flex",
                                      direction: "row",
                                    }}
                                  >
                                    <Button
                                      variant="contained"
                                      size="small"
                                      style={{
                                        textTransform: "none",
                                        fontFamily: "Poppins",
                                        fontStyle: "normal",
                                        fontWeight: "500",

                                        background: `linear-gradient(135deg, #DF98FA 0%, #9055FF 100%)`,
                                      }}
                                      onClick={() => handleEditClick(task.id)}
                                    >
                                      <EditOutlinedIcon
                                        style={{
                                          width: "30px",
                                          height: "30px",
                                        }}
                                      />
                                    </Button>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      style={{
                                        textTransform: "none",
                                        background: `linear-gradient(135deg, gray 0%, black 100%)`,

                                        marginLeft: "10px",
                                        fontFamily: "Poppins",
                                        fontStyle: "normal",
                                        fontWeight: "500",
                                      }}
                                      onClick={() => handleDeleteTask(task.id)}
                                    >
                                      <DeleteIcon
                                        style={{
                                          width: "30px",
                                          height: "30px",
                                        }}
                                      />
                                    </Button>
                                  </div>
                                </ListItem>
                              </List>
                            </nav>
                            <Divider style={{ width: "100%" }} />
                          </Box>
                        </>
                      )}
                    </Grid>
                  ))}
              </Grid>
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  );
}

function TaskEditForm({ task, onSave, open, setOpen, editingTask }) {
  // Initialize editedData state with the task prop
  const [editedData, setEditedData] = useState(task);
  const [isError, setIsError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // Truncate the input value to 10 digits
      let inputValue = value.slice(0, 10);
      setEditedData({ ...editedData, [name]: inputValue });

      // Set isError if the length is not 10
      setIsError(inputValue.length !== 10);
    } else {
      setEditedData({ ...editedData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      editedData.userName.trim() === "" ||
      editedData.fatherName.trim() === "" ||
      editedData.phoneNumber.length < 10
    ) {
      // Provide user feedback or handle the case when the input is not valid.
      console.log("Please fill in all required fields.");
    } else {
      // Only save and close the dialog when all input is valid
      onSave(editedData);
      setUpdatedData(editedData);
      setOpen(false);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            style={{
              flex: 1,
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Card style={{ boxShadow: "none" }}>
              <CardContent>
                <Dialog
                  open={open}
                  onClose={handleSubmit}
                  TransitionComponent={Transition}
                >
                  <DialogTitle>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: "18px",
                          fontWeight: "500",
                          fontFamily: "Poppins",
                        }}
                      >
                        Update User
                      </Typography>

                      <CloseRoundedIcon
                        onClick={handleSubmit}
                        style={{
                          color: "gray",
                          height: "30px",
                          width: "30px",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </DialogTitle>

                  <DialogContent>
                    <form onSubmit={handleSubmit}>
                      <div>
                        <TextField
                          required
                          color="secondary"
                          variant="standard"
                          size="small"
                          label="Username"
                          name="userName"
                          type="text"
                          value={editedData.userName}
                          onChange={handleInputChange}
                          style={{ marginTop: "10px" }}
                        />
                      </div>
                      <div>
                        <TextField
                          required
                          color="secondary"
                          variant="standard"
                          size="small"
                          label="Father's Name"
                          name="fatherName"
                          type="text"
                          value={editedData.fatherName}
                          onChange={handleInputChange}
                          style={{ marginTop: "20px" }}
                        />
                      </div>
                      <div>
                        <TextField
                          required
                          color="secondary"
                          variant="standard"
                          helperText={
                            isError ? "Number should be 10 digits" : ""
                          }
                          size="small"
                          label="Phone Number"
                          name="phoneNumber"
                          component="div"
                          error={isError}
                          type="phoneNumber"
                          value={editedData.phoneNumber}
                          onChange={handleInputChange}
                          style={{ marginTop: "20px" }}
                        />
                      </div>

                      <div>
                        <Button
                          color="secondary"
                          type="submit"
                          size="small"
                          variant="contained"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "0 auto",
                            background: `linear-gradient(135deg, #DF98FA 0%, #9055FF 100%)`,
                            textTransform: "none",
                            fontSize: "16px",
                            fontWeight: 500,
                            marginTop: "20px",
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ShowUser;
