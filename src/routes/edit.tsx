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

export default function EditGoals() {
  const navigate = useNavigate();
  const data = useLoaderData() as { dateId: string };
  return (
    <>
      <div>
        <label className="flex gap-2 mb-4 items-center">
          <span className="text-xl">Goal:</span>
          <input
            placeholder="Goal"
            aria-label="Goal"
            type="text"
            name="goalName"
            required
            className="focus:outline-none rounded-lg border-2 border-black p-2"
          />
        </label>
        <label className="flex gap-2 mb-4 items-center">
          <span className="text-xl">Start Date:</span>
          <input
            type="date"
            name="startDate"
            className="focus:outline-none rounded-lg border-2 border-black p-2"
            defaultValue={data.dateId == null ? convertToDate(data.dateId) : ""}
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
