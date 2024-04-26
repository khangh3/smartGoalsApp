import { useState } from "react";
import { LoaderFunction, useLoaderData, useNavigate } from "react-router-dom";

export const loader: LoaderFunction = ({ params, request }) => {
  return { dateId: params.dateId ? params.dateId : "" };
};

const convertToDate = (dateId: string) => {
  const year = dateId.slice(0, 4);
  const month = dateId.slice(4, 6);
  const day = dateId.slice(6);
  return year.concat("-", month, "-", day);
};

const Task = ({ name }: { name: string }) => {
  return (
    <label className="flex gap-1 mb-2 items-center">
      <button
        aria-label="Task"
        className="rounded-lg border-2 border-black p-2 w-4/6"
      >
        Task
      </button>
      <button className="border-2 border-black p-2 rounded-lg">➕</button>
    </label>
  );
};

export default function EditGoals() {
  const navigate = useNavigate();
  const data = useLoaderData() as { dateId: string };
  const date = convertToDate(data.dateId);

  const [tasks, setTasks] = useState<string[]>([]);
  const taskElements = tasks.map((element, index) => {
    return (
      <li key={index}>
        <Task name={`task${index}`} />
      </li>
    );
  });

  return (
    <>
      <div>
        <div className="flex flex-col mb-4">
          <label className="flex gap-1 mb-2 items-center">
            <input
              placeholder="Goal"
              aria-label="Goal"
              type="text"
              name="objective"
              required
              className="focus:outline-none rounded-lg border-2 border-black p-2"
            />
            <button
              className="border-2 border-black p-2 rounded-lg"
              onClick={() => {
                const newTasks = tasks.slice();
                const id = Math.random().toString(36).substring(2, 9);
                newTasks.push(id);
                console.log(newTasks);
                setTasks(newTasks);
              }}
            >
              ➕
            </button>
          </label>
          <textarea
            rows={3}
            placeholder="Description"
            className="focus:outline-none border-2 border-black rounded-lg p-2"
          />
        </div>
        <ul>{taskElements}</ul>
        <label className="flex gap-2 mb-4 items-center">
          <span className="text-xl">Start Date:</span>
          <input
            type="date"
            name="startDate"
            className="focus:outline-none rounded-lg border-2 border-black p-2"
            defaultValue={date}
          />
        </label>
        <label className="flex gap-2 mb-4 items-center">
          <span className="text-xl">End Date:</span>
          <input
            type="date"
            name="endDate"
            className="focus:outline-none rounded-lg border-2 border-black p-2"
          />
        </label>
        <div className="text-center">
          <button>Submit</button>
          <button className="ml-2" type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
