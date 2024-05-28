import { Link, LoaderFunction, useLoaderData } from "react-router-dom";
import { MonthToDays, MonthsToNames, Day } from "../api";

export const loader: LoaderFunction = async ({ params }) => {
  console.log(params);
  return null;
};

const getCalendar = (date: Date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 0o1);
  // const firstDate = new Date("10-01-2024");

  // get weekday
  const weekday = firstDayOfMonth.getDay();

  // find the date of the first sunday
  let firstDayOfCalendar = firstDayOfMonth;

  // if this date is not the very first day, then find it
  if (weekday > 0) {
    // find how far away it is from sunday
    const difference = weekday - 1;

    // if january set previous month to 11 aka December
    const previousMonth =
      firstDayOfMonth.getMonth() !== 0 ? firstDayOfMonth.getMonth() - 1 : 11;

    const day = MonthToDays[previousMonth] - difference;
    firstDayOfCalendar = new Date(
      // if january set year to previous year
      firstDayOfMonth.getMonth() !== 0
        ? firstDayOfMonth.getFullYear()
        : firstDayOfMonth.getFullYear() - 1,
      previousMonth,
      day,
    );
  }
  let year = firstDayOfCalendar.getFullYear();
  let month = firstDayOfCalendar.getMonth();
  let day = firstDayOfCalendar.getDate();

  // now fill out the 5x7 calendar
  const calendar = Array<Day>(35);
  for (let i = 0; i < calendar.length; ++i) {
    const s: Day = {
      year: year,
      month: month,
      day: day,
      currentMonth: month === date.getMonth(),
    };
    calendar[i] = s;

    // increment dayArr
    if (day !== MonthToDays[month]) {
      day += 1;
    } else {
      if (month === 11) {
        month = 0;
        year += 1;
      } else {
        month += 1;
      }
      day = 1;
    }
  }
  return calendar;
};

const ClickableBoxes = ({ date }: { date: Day }) => {
  const month = date.month + 1;
  const url =
    date.year.toString() +
    (month >= 10 ? month : "0" + month) +
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
  const calendar = getCalendar(date).map((day, index) => {
    return (
      <li key={index} className="border border-black">
        <ClickableBoxes date={day} />
      </li>
    );
  });
  return (
    <ul className="w-5/6 grid grid-cols-7 gap-0 m-2 border border-black">
      <li className="h-10 border-black border text-center">
        <h1>Sunday</h1>
      </li>
      <li className="h-10 border-black border text-center">
        <h1>Monday</h1>
      </li>
      <li className="h-10 border-black border text-center">
        <h1>Tuesday</h1>
      </li>
      <li className="h-10 border-black border text-center">
        <h1>Wednesday</h1>
      </li>
      <li className="h-10 border-black border text-center">
        <h1>Thursday</h1>
      </li>
      <li className="h-10 border-black border text-center">
        <h1>Friday</h1>
      </li>
      <li className="h-10 border-black border text-center">
        <h1>Saturday</h1>
      </li>
      {calendar}
    </ul>
  );
};

export default function Root() {
  const date = new Date();

  return (
    <>
      <h1 className="font-bold text-4xl">
        {MonthsToNames[date.getMonth()]} {date.getFullYear()}{" "}
      </h1>
      <Link to={"/createGoal"} className="pb-5">
        Create New Goal
      </Link>
      <Calendar date={date} />
    </>
  );
}
