import { Form, useLoaderData, redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getYearFromDateId } from "../components/util/util";

export async function action({ request, params }) {
  const formData = await request.formData();
  const object = Object.fromEntries(formData);

  let response = await fetch("http://localhost:5050/goal", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  });
  const goal = await response.json();

  // adds goal to date/s
  const startDate = parseInt(object.startDate.split("-").join(""));
  const endDate = parseInt(
    object.endDate ? object.endDate.split("-").join("") : startDate,
  );
  console.log("start date: ", startDate, ", end date: ", endDate);
  for (let count = 0; startDate + count <= endDate; ++count) {
    const date = startDate + count;
    response = await fetch(`http://localhost:5050/date/${date}`, {
      method: "PATCH",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goal),
    });
    const result = await response.json();
    console.log(result);
  }

  return redirect(params.dateId ? `/date/${params.dateId}` : "/");
}

// loads in goals if applicable
// loads in start date if applicable
export async function dateLoader({ request, params }) {
  const loaderData = {
    startDate: getYearFromDateId(params.dateId),
  };
  return loaderData;
}

export function loader({ request, params }) {
  return {};
}

export default function EditGoal() {
  const navigate = useNavigate();
  const loaderData = useLoaderData();
  const { startDate } = loaderData;

  return (
    <div>
      <Form method="post" id="goal-form" className="flex flex-col gap-2">
        <label className="flex gap-2">
          <span>Goal</span>
          <input
            placeholder="Goal"
            aria-label="Goal"
            type="text"
            name="goalName"
            required
          />
        </label>
        <label className="flex gap-2">
          <span>How will this goal be measured?</span>
          <textarea name="goalMeasurement" required rows={3} />
        </label>
        <label className="flex gap-2">
          <span>Start Date</span>
          <input
            required
            type="date"
            name="startDate"
            defaultValue={startDate || ""}
          />
        </label>
        <label className="flex gap-2">
          <span>End Date</span>
          <input type="date" name="endDate" />
        </label>
        <div className="flex gap-2">
          <button type="submit">Save</button>
          <button
            type="button"
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}
