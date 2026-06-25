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
import { getFirestore } from "firebase/firestore";

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
      const response = await axios.get(`${API_URL}/uid/${user.uid}`);
      localStorage.setItem("mongoUser", JSON.stringify(response.data));
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // Not found, register as a normal user
        const response = await axios.post(`${API_URL}/register`, {
          uid: user.uid,
          userName: user.displayName || "Google User",
          email: user.email,
          role: "user",
          phoneNumber: "0000000000",
        });
        localStorage.setItem("mongoUser", JSON.stringify(response.data));
      } else {
        console.error("Error syncing Google user with MongoDB", err);
      }
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const signInWithGoogleAsAdmin = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    
    // Sync Google user with MongoDB as admin
    try {
      const response = await axios.get(`${API_URL}/uid/${user.uid}`);
      localStorage.setItem("mongoUser", JSON.stringify(response.data));
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // Not found, register as admin
        const response = await axios.post(`${API_URL}/register`, {
          uid: user.uid,
          userName: user.displayName || "Google Admin",
          email: user.email,
          role: "admin",
          phoneNumber: "0000000000",
        });
        localStorage.setItem("mongoUser", JSON.stringify(response.data));
      } else {
        console.error("Error syncing Google user with MongoDB", err);
      }
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
    throw err;
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
    const response = await axios.post(`${API_URL}/register`, {
      uid: user.uid,
      userName,
      email,
      role,
      phoneNumber,
      fatherName
    });
    localStorage.setItem("mongoUser", JSON.stringify(response.data));
  } catch (err) {
    console.error(err);
    alert(err.message);
    throw err;
  }
};

// Register Normal User via Donation Page
const registerNormalUserWithDonation = async (userName, email, password, phoneNumber, fatherName, donationType, amount, year, month, day) => {
  try {
    // Check if phone number is already registered in MongoDB
    const checkRes = await axios.get(`${API_URL}/check-phone/${phoneNumber}`);
    if (checkRes.data.exists) {
      throw new Error("This phone number is already registered. Please sign in instead.");
    }

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
    const finalRes = await axios.put(`${API_URL}/${mongoUser.id}`, updatedData);
    localStorage.setItem("mongoUser", JSON.stringify(finalRes.data));
    return finalRes.data;
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
  localStorage.removeItem("mongoUser");
  signOut(auth);
};

const API_URL = "http://localhost:3001/books";

// Create Task
const createTask = async (userName, phoneNumber, fatherName, year, month, day, amount, purpose = null) => {
  try {
    const bookData = {
      userName,
      phoneNumber,
      fatherName,
      mosque: (!purpose || purpose.toLowerCase() === "mosque") ? [
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
      ] : [],
      imam: (!purpose || purpose.toLowerCase() === "imam") ? [
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
      ] : [],
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

// Register user in auth and MongoDB before payment
const registerUserBeforePayment = async (userName, email, password, phoneNumber, fatherName) => {
  try {
    // Check if phone number is already registered in MongoDB
    const checkRes = await axios.get(`${API_URL}/check-phone/${phoneNumber}`);
    if (checkRes.data.exists) {
      throw new Error("This phone number is already registered. Please sign in instead.");
    }

    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    
    // Call backend to create user in MongoDB
    const response = await axios.post(`${API_URL}/register`, {
      uid: user.uid,
      userName,
      email,
      role: "user",
      phoneNumber,
      fatherName
    });
    localStorage.setItem("mongoUser", JSON.stringify(response.data));
    return response.data;
  } catch (err) {
    console.error("Error in registerUserBeforePayment:", err);
    throw err;
  }
};

// Append donation details to an existing logged in user's profile
const logDonationForLoggedInUser = async (uid, userName, phoneNumber, fatherName, donationType, amount, year, month, day) => {
  try {
    // 1. Fetch user from MongoDB by Firebase UID
    const response = await axios.get(`${API_URL}/uid/${uid}`);
    const mongoUser = response.data;

    // 2. Update user info and log donation
    const updatedData = { ...mongoUser };
    if (userName) updatedData.userName = userName;
    if (phoneNumber) updatedData.phoneNumber = phoneNumber;
    if (fatherName) updatedData.fatherName = fatherName;

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

    // 3. Save donation data
    const updateResponse = await axios.put(`${API_URL}/${mongoUser.id}`, updatedData);
    localStorage.setItem("mongoUser", JSON.stringify(updateResponse.data));
    return updateResponse.data;
  } catch (error) {
    console.error("Error logging donation for logged in user:", error);
    // If the MongoDB user document doesn't exist, register them in MongoDB
    if (error.response && error.response.status === 404) {
      const registerRes = await axios.post(`${API_URL}/register`, {
        uid,
        userName,
        email: auth.currentUser ? auth.currentUser.email : "",
        role: "user",
        phoneNumber,
        fatherName
      });
      const mongoUser = registerRes.data;
      
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
        updatedData.mosque = [donationItem];
      } else {
        updatedData.imam = [donationItem];
      }
      
      const updateResponse = await axios.put(`${API_URL}/${mongoUser.id}`, updatedData);
      localStorage.setItem("mongoUser", JSON.stringify(updateResponse.data));
      return updateResponse.data;
    }
    throw error;
  }
};

// All exports
export {
  auth,
  db,
  signInWithGoogle,
  signInWithGoogleAsAdmin,
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
  registerUserBeforePayment,
  logDonationForLoggedInUser,
};
