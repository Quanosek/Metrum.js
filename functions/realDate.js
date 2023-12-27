import colors from "colors";

export default () => {
  const options = {
    timeZone: "Europe/Warsaw",

    day: "2-digit",
    month: "2-digit",
    year: "numeric",

    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const newDate = new Intl.DateTimeFormat("pl-PL", options).format(new Date());
  return colors.brightCyan(`[${newDate}]`);
};
