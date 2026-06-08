import { initializeApp } from "firebase/app";
import axios from "axios";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
  query,
  where,
  getDoc,
} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATn5viI7qe90zeaE3M6uVNH0nWzMfN4yM",
  authDomain: "mosque-74315.firebaseapp.com",
  projectId: "mosque-74315",
  storageBucket: "mosque-74315.appspot.com",
  messagingSenderId: "778550086987",
  appId: "1:778550086987:web:e5b5af826e2c6892332cce",
  measurementId: "G-DD05JQBHY6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Sign in
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    
    // Sync Google user with MongoDB
    try {
      await axios.get(`${API_URL}/uid/${user.uid}`);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // Not found, register as a normal user
        await axios.post(`${API_URL}/register`, {
          uid: user.uid,
          userName: user.displayName || "Google User",
          email: user.email,
          role: "user",
          phoneNumber: "0000000000",
        });
      } else {
        console.error("Error syncing Google user with MongoDB", err);
      }
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
    throw err;
  }
};

// Register Admin
const registerWithEmailAndPassword = async (userName, email, password, role = "admin", phoneNumber = "0000000000", fatherName = "") => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    
    // Call backend to create user in MongoDB with admin/specified role
    await axios.post(`${API_URL}/register`, {
      uid: user.uid,
      userName,
      email,
      role,
      phoneNumber,
      fatherName
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
    throw err;
  }
};

// Register Normal User via Donation Page
const registerNormalUserWithDonation = async (userName, email, password, phoneNumber, fatherName, donationType, amount, year, month, day) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    
    // 1. Create/link user in MongoDB with role 'user'
    const response = await axios.post(`${API_URL}/register`, {
      uid: user.uid,
      userName,
      email,
      role: "user",
      phoneNumber,
      fatherName
    });

    const mongoUser = response.data;

    // 2. Log their donation to their account
    const updatedData = { ...mongoUser };
    const donationItem = {
      year,
      months: [
        {
          day,
          month,
          amount: Number(amount)
        }
      ]
    };

    if (donationType.toLowerCase() === 'mosque') {
      if (!updatedData.mosque) updatedData.mosque = [];
      const yearIdx = updatedData.mosque.findIndex(y => y.year === year);
      if (yearIdx > -1) {
        updatedData.mosque[yearIdx].months.push({ day, month, amount: Number(amount) });
      } else {
        updatedData.mosque.push(donationItem);
      }
    } else {
      if (!updatedData.imam) updatedData.imam = [];
      const yearIdx = updatedData.imam.findIndex(y => y.year === year);
      if (yearIdx > -1) {
        updatedData.imam[yearIdx].months.push({ day, month, amount: Number(amount) });
      } else {
        updatedData.imam.push(donationItem);
      }
    }

    // Save donation data
    await axios.put(`${API_URL}/${mongoUser.id}`, updatedData);
    return mongoUser;
  } catch (err) {
    console.error(err);
    alert(err.message);
    throw err;
  }
};

// Password Reset
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// Logout
const logout = () => {
  signOut(auth);
};

const API_URL = "http://localhost:3001/books";

// Create Task
const createTask = async (userName, phoneNumber, fatherName, year, month, day, amount) => {
  try {
    const bookData = {
      userName,
      phoneNumber,
      fatherName,
      mosque: [
        {
          year,
          months: [
            {
              day: day,
              month: month,
              amount: amount,
            },
          ],
        },
      ],
      imam: [
        {
          year,
          months: [
            {
              day: day,
              month: month,
              amount: amount,
            },
          ],
        },
      ],
    };

    const response = await axios.post(API_URL, bookData);
    return response.data.id;
  } catch (error) {
    console.error("Error creating book:", error);
    throw error;
  }
};

// Update a task by ID
const updateTask = async (taskId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${taskId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Delete a task by ID
const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${API_URL}/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Get a list of all tasks (with optional filters)
const getAllTasks = async (filters = {}) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// firebase.js
const getTaskById = async (taskId) => {
  try {
    const response = await axios.get(`${API_URL}/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};

// All exports
export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  registerNormalUserWithDonation,
  sendPasswordReset,
  logout,
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
  getTaskById,
};
