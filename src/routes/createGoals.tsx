import { useState, FormEventHandler } from "react";
import {
  ActionFunction,
  LoaderFunction,
  useLoaderData,
  useNavigate,
  useSubmit,
  redirect,
  json,
} from "react-router-dom";
import { GoalDocument, Task, TaskDocument, Day, MonthToDays } from "../api";

export const loader: LoaderFunction = ({ params }) => {
  return { dateId: params.dateId ? params.dateId : "" };
};

export const action: ActionFunction = async ({ request, params }) => {
  const { goal } = await request.json();
  let goalDocument: GoalDocument = {
    tasks: Array<TaskDocument>(),
    root: goal.id,
    startDate: goal.startDate,
    endDate: goal.endDate ? goal.endDate : goal.startDate,
  };

  const convertTaskTreeToArray = (task: Task) => {
    // gets dates
    const goalDuration = (task.endDate ? task.endDate - task.startDate : 0) + 1;
    const dates = Array<Day>();
    const startDate = task.startDate.toString();
    let year = parseInt(startDate.slice(0, 4));
    let month = parseInt(startDate.slice(4, 6));
    let day = parseInt(startDate.slice(6));
    for (let i = 0; i < goalDuration; ++i) {
      dates.push({
        year: year,
        month: month,
        day: day,
      });

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

    // push document
    goalDocument.tasks.push({
      id: task.id,
      children: task.children.map((child) => child.id),
      objective: task.objective,
      description: task.description,
      dates: dates,
      completionStatus: Array<boolean>(goalDuration).fill(false),
    });

    // get children
    if (task.children) {
      for (let i = 0; i < task.children.length; ++i) {
        convertTaskTreeToArray(task.children[i]);
      }
    }
  };
  convertTaskTreeToArray(goal);
  const response = await fetch("http://localhost:5050/goals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(goalDocument),
  });
  console.log(await response.json());
  return redirect(`/dates/${goalDocument.startDate}`);
};

const convertDateToString = (dateId: string) => {
  const year = dateId.slice(0, 4);
  const month = dateId.slice(4, 6);
  const day = dateId.slice(6);
  return year.concat("-", month, "-", day);
};

const convertDateToInt = (date: string) => {
  return parseInt(date.split("-").join(""));
};

type TaskElementProp = {
  task: Task;
  index: number;
  relayChanges: (index: number, nextChild: Task | null) => void;
};

const TaskElement = ({ task, index, relayChanges }: TaskElementProp) => {
  // functions
  // this funciton takes in 2 case
  // case 1: the miniTask has a child
  // case 2: miniTask requests to be deleted indicated by a null value in miniTask
  const updateMiniTask = (childIndex: number, miniTask: Task | null) => {
    const nextMiniTasks = task.children.slice();
    miniTask !== null
      ? nextMiniTasks.splice(childIndex, 1, miniTask)
      : nextMiniTasks.splice(childIndex, 1);

    const nextTask = {
      ...task,
      children: nextMiniTasks,
    };
    relayChanges(index, nextTask);
  };

  const addMiniTask = () => {
    const nextChildren = task.children.slice();
    nextChildren.push({
      id: createId(),
      children: [],
      objective: "",
      startDate: task.startDate,
    });
    const nextTask = {
      ...task,
      children: nextChildren,
    };
    relayChanges(index, nextTask);
  };

  const miniTasks = task.children.map((miniTask, index) => {
    return (
      <li key={miniTask.id}>
        <TaskElement
          task={miniTask}
          index={index}
          relayChanges={updateMiniTask}
        />
      </li>
    );
  });

  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <label className="flex gap-1 mb-2 items-center">
        <input
          placeholder="Task"
          aria-label="Task"
          type="text"
          name="objective"
          required
          className="focus:outline-none rounded-lg border-2 border-black p-2"
          onChange={(e) => (task.objective = e.target.value)}
          onDoubleClick={() => setShowMore(true)}
          autoComplete="off"
        />
        {showMore ? (
          <>
            <div className="border-2 border-black p-2 rounded-lg w-full z-20">
              <textarea
                placeholder="Description"
                className="focus:outline-none rounded-lg border-2 border-black p-2 w-full"
                onChange={(e) => (task.description = e.target.value)}
                defaultValue={task.description}
              />
              <label className="flex gap-2 mb-4 items-center">
                <span className="text-xl"> Start Date: </span>
                <input
                  type="date"
                  name="startDate"
                  className="focus:outline-none rounded-lg border-2 border-black p-2 w-full"
                  defaultValue={convertDateToString(task.startDate.toString())}
                  required
                  onChange={(e) =>
                    (task.startDate = convertDateToInt(e.target.value))
                  }
                />
              </label>
              <label className="flex gap-2 mb-4 items-center">
                <span className="text-xl"> End Date: </span>
                <input
                  type="date"
                  name="endDate"
                  className="focus:outline-none rounded-lg border-2 border-black p-2 w-full"
                  onChange={(e) =>
                    (task.endDate = convertDateToInt(e.target.value))
                  }
                />
              </label>
              <button
                type="button"
                className="border-2 border-black p-2 rounded-lg"
                onClick={() => relayChanges(index, null)}
              >
                Delete
              </button>
            </div>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMore(false)}
            ></div>
          </>
        ) : (
          <button
            type="button"
            className="border-2 border-black p-2 rounded-lg"
            onClick={() => addMiniTask()}
          >
            ➕
          </button>
        )}
      </label>
      <ul> {miniTasks} </ul>
    </>
  );
};

const createId = () => Math.random().toString(36).substring(2, 9);

export default function CreateGoal() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const data = useLoaderData() as { dateId: string };
  const dateInput = convertDateToString(data.dateId);
  const date = data.dateId ? parseInt(data.dateId) : 0;

  const [goal, setGoal] = useState<Task>({
    id: createId(),
    children: [],
    objective: "",
    startDate: date,
  });

  // functions
  const updateChild = (index: number, nextTask: Task | null) => {
    const nextTasks = goal.children.slice();
    nextTask !== null
      ? nextTasks.splice(index, 1, nextTask)
      : nextTasks.splice(index, 1);

    setGoal({
      ...goal,
      children: nextTasks,
    });
  };

  const addTask = () => {
    const nextChildren = goal.children.slice();
    nextChildren.push({
      id: createId(),
      children: [],
      objective: "",
      startDate: goal.startDate,
    });
    setGoal({
      ...goal,
      children: nextChildren,
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    submit({ goal: goal }, { method: "POST", encType: "application/json" });
  };

  const tasks = goal.children.map((task, index) => {
    return (
      <li key={task.id}>
        <TaskElement task={task} index={index} relayChanges={updateChild} />
      </li>
    );
  });

  return (
    <>
      <form method="POST" onSubmit={handleSubmit}>
        <div className="flex flex-col mb-4">
          <label className="flex gap-1 mb-2">
            <input
              autoComplete="off"
              placeholder="Goal"
              aria-label="Goal"
              type="text"
              name="objective"
              required
              className="focus:outline-none rounded-lg border-2 border-black p-2"
              onChange={(e) => (goal.objective = e.target.value)}
            />
            <button
              type="button"
              className="border-2 border-black p-2 rounded-lg"
              onClick={() => addTask()}
            >
              ➕
            </button>
          </label>
          <textarea
            rows={3}
            placeholder="Description"
            className="focus:outline-none rounded-lg border-2 border-black p-2 flex-grow-0"
            onChange={(e) => (goal.description = e.target.value)}
            defaultValue={goal.description}
          />
        </div>
        <ul> {tasks} </ul>
        <label className="flex gap-2 mb-4 items-center">
          <span className="text-xl"> Start Date: </span>
          <input
            type="date"
            name="startDate"
            className="focus:outline-none rounded-lg border-2 border-black p-2"
            defaultValue={dateInput}
            required
            onChange={(e) =>
              (goal.startDate = convertDateToInt(e.target.value))
            }
          />
        </label>
        <label className="flex gap-2 mb-4 items-center">
          <span className="text-xl"> End Date: </span>
          <input
            type="date"
            name="endDate"
            className="focus:outline-none rounded-lg border-2 border-black p-2"
            onChange={(e) => (goal.endDate = convertDateToInt(e.target.value))}
          />
        </label>
        <div className="text-center">
          <button
            type="submit"
            className="border-black border-2 rounded-lg p-2"
          >
            Submit
          </button>
          <button
            type="button"
            className="ml-2 border-black border-2 rounded-lg p-2"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
