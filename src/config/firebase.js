import { initializeApp } from "firebase/app";
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
  onSnapshot,
  getDoc,
  arrayUnion,
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
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        userName: user.displayName,
        authProvider: "google",
        email: user.email,
      });
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
  }
};

// Register
const registerWithEmailAndPassword = async (userName, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      userName,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
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

// Create Task
const createTask = async (userName, phoneNumber, fatherName, year,month,day, amount) => {
  try {
    // Define the book data
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

    // Add the book data to the "books" collection in Firestore
    const taskRef = await addDoc(collection(db, "tasks"), bookData);

    // Return the ID of the newly created book
    return taskRef.id;
  } catch (error) {
    console.error("Error creating book:", error);
    throw error;
  }
};

// Update a task by ID
const updateTask = async (taskId, updatedData) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, updatedData);
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};


// Delete a task by ID
const deleteTask = async (taskId) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Get a list of all tasks (with optional filters)
const getAllTasks = async (filters = {}) => {
  try {
    const taskCollection = collection(db, "tasks");
    let queryRef = query(taskCollection);

    const taskSnapshot = await getDocs(queryRef);
    const tasks = taskSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// firebase.js
const getTaskById = async (taskId) => {
  try {
    const taskDoc = doc(db, "tasks", taskId);
    const taskSnapshot = await getDoc(taskDoc);

    if (taskSnapshot.exists()) {
      return { id: taskSnapshot.id, ...taskSnapshot.data() };
    } else {
      throw new Error("Task not found");
    }
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
  sendPasswordReset,
  logout,
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
  getTaskById,
};
