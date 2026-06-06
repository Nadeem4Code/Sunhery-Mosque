import React, { useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
// Card
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const Donate = () => {
  const [donate, setDonate] = React.useState("");

  // For the donation
  const handleDonate = (event) => {
    setDonate(event.target.value);
  };

  console.log(donate);
  return (
    <div
      style={{
        marginTop: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card style={{ width: "300px" }}>
        <CardContent
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Donate</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="mosque"
                control={<Radio />}
                label="Mosque"
                onClick={handleDonate}
             
              />
              <FormControlLabel
                value="Imam"
                control={<Radio />}
                label="Imam"
                onClick={handleDonate}
             
              />
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>
    </div>
  );
};
export default Donate;
