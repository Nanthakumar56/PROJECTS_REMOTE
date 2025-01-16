import dayjs from "dayjs";

export const DateCalender = (
  month = dayjs().month(),
  year = dayjs().year()
) => {
  const firstDateofMonth = dayjs().year(year).month(month).startOf("month");
  const lastDateofMonth = dayjs().year(year).month(month).endOf("month");

  const arrayOfDate = [];

  // prefix dates
  for (let i = 0; i < firstDateofMonth.day(); i++) {
    arrayOfDate.push({ currentMonth: false, date: firstDateofMonth.day(i) });
  }

  //generate current date
  for (let i = firstDateofMonth.date(); i <= lastDateofMonth.date(); i++) {
    arrayOfDate.push({
      currentMonth: true,
      date: firstDateofMonth.date(i),
      today:
        firstDateofMonth.date(i).toDate().toDateString() ===
        dayjs().toDate().toDateString(),
    });
  }

  const remaining = 42 - arrayOfDate.length;

  for (
    let i = lastDateofMonth.date() + 1;
    i <= lastDateofMonth.date() + remaining;
    i++
  ) {
    arrayOfDate.push({ currentMonth: false, date: lastDateofMonth.date(i) });
  }
  return arrayOfDate;
};

export default function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
