import { createContext, useState, useCallback, useMemo, useEffect } from "react";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

const UserContext = createContext();

function Provider({ children }) {
  const [books, setBooks] = useState([]);
  
  const [user, loading] = useAuthState(auth);
  const [mongoUser, setMongoUser] = useState(() => {
    const saved = localStorage.getItem("mongoUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [mongoUserLoading, setMongoUserLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (user) {
      setMongoUserLoading(true);
      const isAdminEmail = user.email === "7457861116@jama-masjid.com";
      axios
        .get(`http://localhost:3001/books/uid/${user.uid}`)
        .then((res) => {
          let data = res.data;
          // Force update in case role or userName is incorrect for admin
          if (isAdminEmail && (data.role !== "admin" || data.userName !== "Mohd Nadeem")) {
            axios.put(`http://localhost:3001/books/${data.id}`, {
              ...data,
              userName: "Mohd Nadeem",
              role: "admin",
              phoneNumber: "7457861116"
            })
            .then((updateRes) => {
              setMongoUser(updateRes.data);
              localStorage.setItem("mongoUser", JSON.stringify(updateRes.data));
              setMongoUserLoading(false);
            })
            .catch((updateErr) => {
              console.error("Failed to update admin details in Context:", updateErr);
              setMongoUser(data);
              localStorage.setItem("mongoUser", JSON.stringify(data));
              setMongoUserLoading(false);
            });
          } else {
            setMongoUser(data);
            localStorage.setItem("mongoUser", JSON.stringify(data));
            setMongoUserLoading(false);
          }
        })
        .catch((err) => {
          console.error("Context user check failed:", err);
          if (err.response && err.response.status === 404) {
            // Auto-register in MongoDB as admin or standard user
            const regData = {
              uid: user.uid,
              userName: isAdminEmail ? "Mohd Nadeem" : (user.displayName || (user.email ? user.email.split("@")[0] : "Standard User")),
              email: user.email || `${user.uid}@jama-masjid.com`,
              role: isAdminEmail ? "admin" : "user",
              phoneNumber: isAdminEmail ? "7457861116" : (user.phoneNumber || "0000000000"),
              fatherName: ""
            };
            axios.post("http://localhost:3001/books/register", regData)
              .then((regRes) => {
                setMongoUser(regRes.data);
                localStorage.setItem("mongoUser", JSON.stringify(regRes.data));
                setMongoUserLoading(false);
              })
              .catch((regErr) => {
                console.error("Context auto-registration failed:", regErr);
                setMongoUserLoading(false);
              });
          } else {
            setMongoUserLoading(false);
          }
        });
    } else {
      setMongoUser(null);
      localStorage.removeItem("mongoUser");
      setMongoUserLoading(false);
    }
  }, [user, loading]);

  const fetchBooks = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3001/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }, []);

  const editBookById = useCallback(async (id, newTitle, newNumber, fatherName) => {
    try {
      const response = await axios.put(`http://localhost:3001/books/${id}`, {
        title: newTitle,
        number: newNumber,
        father: fatherName,
      });

      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.id === id ? { ...book, ...response.data } : book))
      );
    } catch (error) {
      console.error("Error editing book:", error);
    }
  }, []);

  const deleteBookById = useCallback(async (id) => {
    try {
      await axios.delete(`http://localhost:3001/books/${id}`);
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  }, []);

  // date
  const newDate = new Date();
  const date = newDate.getDate();
  const month = newDate.getMonth() + 1;

  const createBook = useCallback(async (title, number, fatherName, year, amount) => {
    try {
      const response = await axios.post("http://localhost:3001/books", {
        title,
        number,
        fatherName,
        years: [
          {
            year,
            months: [
              {
                date,
                month,
                amount,
              },
            ],
          },
        ],
      });

      setBooks((prevBooks) => [...prevBooks, response.data]);
    } catch (error) {
      console.error("Error creating book:", error);
    }
  }, [date, month]);

  const valueToShare = useMemo(() => ({
    books,
    deleteBookById,
    editBookById,
    createBook,
    fetchBooks,
    user,
    loading,
    mongoUser,
    setMongoUser,
    mongoUserLoading,
  }), [
    books,
    deleteBookById,
    editBookById,
    createBook,
    fetchBooks,
    user,
    loading,
    mongoUser,
    mongoUserLoading
  ]);

  return (
    <UserContext.Provider value={valueToShare}>{children}</UserContext.Provider>
  );
}

export { Provider };
export default UserContext;
