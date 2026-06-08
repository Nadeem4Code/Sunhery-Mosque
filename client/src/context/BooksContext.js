import { createContext, useState, useCallback } from "react";
import axios from "axios";

const UserContext = createContext();

function Provider({ children }) {
  const [books, setBooks] = useState([]);

  const fetchBooks = useCallback(async () => {
    const response = await axios.get("http://localhost:3001/books");

    setBooks(response.data);
  }, []);

  const editBookById = async (id, newTitle, newNumber, fatherName) => {
    const response = await axios.put(`http://localhost:3001/books/${id}`, {
      title: newTitle,
      number: newNumber,
      father: fatherName,
    });

    const updatedBooks = books.map((book) => {
      if (book.id === id) {
        return { ...book, ...response.data };
      }

      return book;
    });

    setBooks(updatedBooks);
  };

  const deleteBookById = async (id) => {
    await axios.delete(`http://localhost:3001/books/${id}`);

    const updatedBooks = books.filter((book) => {
      return book.id !== id;
    });

    setBooks(updatedBooks);
  };

  // date
  let newDate = new Date();

  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;


const createBook = async (title, number, fatherName, year,amount) => {
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
            amount, // Add the amount option here
          },
        ],
      },
    ],
  });

  const updatedBooks = [...books, response.data];
  setBooks(updatedBooks);
};


  const valueToShare = {
    books,
    deleteBookById,
    editBookById,
    createBook,
    fetchBooks,
  };

  return (
    <UserContext.Provider value={valueToShare}>{children}</UserContext.Provider>
  );
}

export { Provider };
export default UserContext;
