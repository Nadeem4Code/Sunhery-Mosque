import { createContext, useState, useCallback, useMemo } from "react";
import axios from "axios";

const UserContext = createContext();

function Provider({ children }) {
  const [books, setBooks] = useState([]);

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
  }), [books, deleteBookById, editBookById, createBook, fetchBooks]);

  return (
    <UserContext.Provider value={valueToShare}>{children}</UserContext.Provider>
  );
}

export { Provider };
export default UserContext;
