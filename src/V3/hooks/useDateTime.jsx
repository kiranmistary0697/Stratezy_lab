import React from "react";

const useDateTime = (date = new Date()) => {
  const parsedDate = new Date(date); // Ensure it's a Date object

  if (isNaN(parsedDate)) {
    return "Invalid date";
  }

  const pad = (num) => String(num).padStart(2, "0");

  const year = parsedDate.getFullYear();
  const month = pad(parsedDate.getMonth() + 1);
  const day = pad(parsedDate.getDate());
  const hours = pad(parsedDate.getHours());
  const minutes = pad(parsedDate.getMinutes());
  const seconds = pad(parsedDate.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default useDateTime;
