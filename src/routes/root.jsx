import { Link, useLoaderData } from "react-router-dom";

const Box = ({ input }) => {
  return (
    <div className="h-24 border-l-2 border-t-2 border-black flex justify-center items-center">
      <h1>{input}</h1>
    </div>
  );
};

const SpecialBox = ({ input }) => {
  const dates = useLoaderData();
  const day = dates.find((element, index) => {
    const day = input < 10 ? "0" + input.toString() : input;
    return element.day == day;
  });
  const url =
    "202404" + (input >= 10 ? input.toString() : "0" + input.toString());
  return (
    <Link
      className="h-24 border-l-2 border-t-2 border-black flex flex-col justify-center items-center"
      to={`date/${url}`}
    >
      <h1 className="">{input}</h1>
      <ul>
        {day
          ? day.goals.map((goal, index) => {
              return <li key={index}>{goal.name}</li>;
            })
          : null}
      </ul>
    </Link>
  );
};

const CalendarGrid = () => {
  const dates = useLoaderData();
  return (
    <div className="grid grid-cols-7 m-2 gap-0 border-b-2 border-r-2 border-black">
      <Box input={"Sunday"} />
      <Box input={"Monday"} />
      <Box input={"Tuesday"} />
      <Box input={"Wednesday"} />
      <Box input={"Thursday"} />
      <Box input={"Friday"} />
      <Box input={"Saturday"} />
      <Box input={31} />
      <SpecialBox input={1} />
      <SpecialBox input={2} />
      <SpecialBox input={3} />
      <SpecialBox input={4} />
      <SpecialBox input={5} />
      <SpecialBox input={6} />
      <SpecialBox input={7} />
      <SpecialBox input={8} />
      <SpecialBox input={9} />
      <SpecialBox input={10} />
      <SpecialBox input={11} />
      <SpecialBox input={12} />
      <SpecialBox input={13} />
      <SpecialBox input={14} />
      <SpecialBox input={15} />
      <SpecialBox input={16} />
      <SpecialBox input={17} />
      <SpecialBox input={18} />
      <SpecialBox input={19} />
      <SpecialBox input={20} />
      <SpecialBox input={21} />
      <SpecialBox input={22} />
      <SpecialBox input={23} />
      <SpecialBox input={24} />
      <SpecialBox input={25} />
      <SpecialBox input={26} />
      <SpecialBox input={27} />
      <SpecialBox input={28} />
      <SpecialBox input={29} />
      <SpecialBox input={30} />
      <Box input={1} />
      <Box input={2} />
      <Box input={3} />
      <Box input={4} />
    </div>
  );
};

const Calendar = () => {
  return (
    <>
      <div className="flex gap-4">
        <h1 className="text-center">April 2024</h1>
        <Link to={"goal"}>Create New Goal</Link>
      </div>
      <CalendarGrid />
    </>
  );
};

export default function Root() {
  return (
    <>
      <Calendar />
    </>
  );
}

// one hell of a function that i can only replace once i understand promises
export async function loader() {
  const response = await fetch("http://localhost:5050/date");
  const date = await response.json();
  const dates = [];
  for (let i = 0; i < date.Dates.length; ++i) {
    const response = await fetch(
      `http://localhost:5050/date/${date.Dates[i]._id}`,
    );
    const goalId = await response.json();

    // get goals
    const goals = [];
    for (let j = 0; j < goalId.length; ++j) {
      const response = await fetch(
        `http://localhost:5050/goal/${goalId[j]._id}`,
      );
      const goal = await response.json();
      goals.push(goal);
    }
    dates.push({
      day: date.Dates[i]._id.substr(6),
      goals: goals,
    });
  }

  return dates;
}
