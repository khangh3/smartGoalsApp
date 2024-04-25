import { useLoaderData, LoaderFunction, Form, Link } from "react-router-dom";

export const loader: LoaderFunction = ({ params, request }) => {
  const dateId = params.dateId;
  return { dateId };
};

const convertToDate = (dateId: string) => {
  const year = dateId.slice(0, 4);
  const month = dateId.slice(4, 6);
  const day = dateId.slice(6);
  return month.concat("-", day, "-", year);
};

export default function Date() {
  const { dateId } = useLoaderData() as { dateId: string };
  const date = convertToDate(dateId);

  return (
    <>
      <h1 className="font-bold text-4xl pb-6">Date: {date}</h1>
      <h2 className="font-bold text-2xl">Goals</h2>
      <ul>
        <li>random goal</li>
      </ul>
      <div className="flex flex-row gap-2 items-center">
        <Form action="editGoals">
          <button type="submit">Create new Goal</button>
        </Form>
        <Link to={"/"}>Return</Link>
      </div>
    </>
  );
}
