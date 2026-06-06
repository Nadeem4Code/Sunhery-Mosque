import React, { useState } from "react";
import "./fivePillars.css";
import Typography from "@mui/material/Typography";

// Icons
import sujud from "../../assets/icons/sujud.svg";
import kaba from "../../assets/icons/kaaba.svg";
import ramzan from "../../assets/icons/ramzan.svg";
import zakat from "../../assets/icons/zakat.svg";
import allah from "../../assets/icons/allah.svg";

const FivePillars = () => {
  const data = [
    { id: 1, name: "Shahada", icon: allah, width: "140px", height: "140px" },
    { id: 2, name: "Namaz", icon: sujud, width: "170px", height: "170px" },
    { id: 3, name: "Hajj", icon: kaba, width: "160px", height: "160px" },
    {
      id: 4,
      name: "Roja",
      icon: ramzan,
      width: "145px",
      height: "130px",
      margin: "35px",
    },
    {
      id: 5,
      name: "Zakat",
      icon: zakat,
      width: "130px",
      height: "130px",
      margin: "35px",
    },
  ];

  const [activeTab, setActiveTab] = useState(data[0].id);

  const handleClick = (id) => {
    setActiveTab(id);
  };

  return (
    <div>
      <ul className="tabs">
        {data.map((item) => (
          <li
            key={item.id}
            className={`tab ${item.id === activeTab ? "active" : ""}`}
            onClick={() => handleClick(item.id)}
          >
            {item.name}
          </li>
        ))}
      </ul>

      <div
        style={{
          position: "relative", // Added position relative
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start", // Changed alignItems to flex-start
        }}
      >
        <Typography
          style={{
            position: "absolute",
            top: 30,
            left: 0,
            fontStyle: "normal",
            fontWeight: "500",
            fontSize: "14px",
            fontFamily: "Poppins",
            color: "#8789A3",
          }}
        >
          The best among you are <br />
          those who bring greatest <br />
          benefits to many others
        </Typography>
      </div>

      <div
        style={{
          height: "170px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <img
          src={data.find((item) => item.id === activeTab).icon}
          style={{
            width: data.find((item) => item.id === activeTab).width,
            height: data.find((item) => item.id === activeTab).height,
            marginBottom: data.find((item) => item.id === activeTab).margin,
          }}
          alt="icon"
        />
      </div>
    </div>
  );
};

export default FivePillars;
