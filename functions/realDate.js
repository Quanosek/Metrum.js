// import
import "colors";

// define function
export default () => {
  const newDate = new Intl.DateTimeFormat("pl-PL", {
    timeZone: "Europe/Warsaw",

    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",

    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  return `[${newDate}]`.brightCyan;
};
