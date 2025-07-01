const generateEndPoint = (endpoint, query) => {
  return `${endpoint}${
    query
      ? `?${Object.entries(query)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")}`
      : ""
  }`;
};
export default generateEndPoint;
