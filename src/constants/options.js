export const optionsOfScheme = [
  { key: "http", text: "http", value: "http" },
  { key: "https", text: "https", value: "https" },
];

export const methodsOptions = ["GET", "POST", "PUT", "DELETE", "HEAD"].map(
  (method) => ({
    key: method,
    text: method,
    value: method,
  }),
);
