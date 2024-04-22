import { Form, Link, useLoaderData } from "react-router-dom";
import { getYearFromDateId } from "../components/util/util";

export async function loader({ params }) {
  const date = getYearFromDateId(params.dateId);
  const response = await fetch(`http://localhost:5050/date/${params.dateId}`);
  const goalId = await response.json();

  // get goals
  const goals = [];
  for (let i = 0; i < goalId.length; ++i) {
    const response = await fetch(`http://localhost:5050/goal/${goalId[i]._id}`);
    const goal = await response.json();
    goals.push(goal);
  }

  const loaderData = {
    date: date,
    goals: goals,
  };
  return loaderData;
}

export default function Date() {
  const loaderData = useLoaderData();
  const { date, goals } = loaderData;
  const goalDisplay = goals.map((element, index) => {
    return <li key={index}>{element.name}</li>;
  });

  return (
    <div>
      <h1 className="text-center">Date: {date}</h1>
      <div className="flex flex-col gap-2 justify-center items-center">
        <h1 className="text-2xl font-bold">Goals</h1>
        <ul className="flex flex-col gap-2 justify-center items-center border-2 border-green-400 p-2">
          {goalDisplay}
        </ul>
      </div>
      <div className="flex flex-row gap-2 justify-center items-center">
        <Form action="goal">
          <button type="submit">Create new Goal</button>
        </Form>
        <Link to={"/"}>Return</Link>
      </div>
    </div>
  );
}
