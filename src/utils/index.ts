export const renderValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};
