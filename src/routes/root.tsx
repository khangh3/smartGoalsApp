import { Link } from "react-router-dom";

// array of number of days in each month
const MonthToDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MonthsToNames = [
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

type Day = {
  day: number;
  month: number;
  year: number;
  currentMonth: boolean;
};

const getCalendar = (date: Date): Day[] => {
  const firstDate = new Date(date.getFullYear(), date.getMonth(), 0o1);
  // const firstDate = new Date("10-01-2024");

  // get weekday
  const weekday = firstDate.getDay();
  let firstDayOfCalendar = firstDate;

  // if this date is not the very first day, then find it
  if (weekday > 0) {
    // find how far away it is from sunday
    const difference = weekday - 1;

    // if january set previous month to 11 aka December
    const previousMonth =
      firstDate.getMonth() !== 0 ? firstDate.getMonth() - 1 : 11;

    const day = MonthToDays[previousMonth] - difference;
    firstDayOfCalendar = new Date(
      // if january set year to previous year
      firstDate.getMonth() !== 0
        ? firstDate.getFullYear()
        : firstDate.getFullYear() - 1,
      previousMonth,
      day,
    );
  }
  let year = firstDayOfCalendar.getFullYear();
  let indexMonth = firstDayOfCalendar.getMonth();
  let month = indexMonth + 1;
  let day = firstDayOfCalendar.getDate();

  // now fill out the 5x7 calendar
  const calendar = Array(35);
  for (let i = 0; i < calendar.length; ++i) {
    const s: Day = {
      year: year,
      month: month,
      day: day,
      currentMonth: indexMonth === date.getMonth(),
    };
    calendar[i] = s;

    // increment dayArr
    if (day !== MonthToDays[indexMonth]) {
      day += 1;
    } else {
      if (indexMonth === 11) {
        indexMonth = 0;
        year += 1;
      } else {
        indexMonth += 1;
      }
      month = indexMonth + 1;
      day = 1;
    }
  }
  return calendar;
};

const ClickableBoxes = ({ date }: { date: Day }) => {
  const url =
    date.year.toString() +
    (date.month >= 10 ? date.month : "0" + date.month) +
    (date.day >= 10 ? date.day : "0" + date.day);
  return (
    <Link className="flex justify-center items-center h-36" to={`dates/${url}`}>
      {date.currentMonth ? (
        <h1 className="text-black">{date.day}</h1>
      ) : (
        <h1 className="text-gray-500">{date.day}</h1>
      )}
    </Link>
  );
};

const Calendar = ({ date }: { date: Date }) => {
  const calendar = getCalendar(date).map((element, index) => {
    return (
      <li key={index} className="border border-black">
        <ClickableBoxes date={element} />
      </li>
    );
  });
  return (
    <ul className="w-5/6 grid grid-cols-7 gap-0 m-2 border border-black">
      {calendar}
    </ul>
  );
};

export default function Root() {
  const date = new Date();

  return (
    <>
      <h1 className="font-bold text-4xl">
        {MonthsToNames[date.getMonth() + 1]} {date.getFullYear()}{" "}
      </h1>
      <Link to={"/editGoals"} className="pb-5">
        Create New Goal
      </Link>
      <Calendar date={date} />
    </>
  );
}
