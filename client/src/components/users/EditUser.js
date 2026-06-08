import { useState } from "react";
import useBooksContext from "../../hooks/useBooksContext";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";

// Card
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";


function BookEdit({ book, onSubmit }) {
  const [title, setTitle] = useState(book.title);
  const [number, setNumber] = useState(book.number);


  const [isError, setIsError] = useState(false);
  const { editBookById } = useBooksContext();

  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleNumber = (e) => {
    let inputValue = e.target.value;
    if (inputValue.length > 10) {
      inputValue = inputValue.slice(0, 10); // Truncate the input value to 10 digits
    }
    setNumber(inputValue);
    setIsError(inputValue.length !== 10);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (number.length !== 10) {
      setIsError(true);
      return; // Return early without creating the book
    }

    onSubmit();
    editBookById(book.id, title, number);
  };

 

  return (
    <Card
      style={{
        flex: 1,
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        marginTop: "50px",
      }}
      sx={{ maxWidth: 150 }}
    >
   
      <CardContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            required
            size="small"
            value={title}
            onChange={handleChange}
            style={{
              flex: 1,
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              marginTop: "20px",
            }}
          />
          <br />
          <TextField
            size="small"
            helperText={isError ? "Number should be 10 digits" : ""}
            label="Number"
            required
            variant="outlined"
            component="div"
            error={isError}
            type="number"
            value={number}
            onChange={handleNumber}
          />
          <br />
          <Button
            type="submit"
            variant="contained"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "20px auto",
              backgroundColor: "green",
            }}
          >
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default BookEdit;
