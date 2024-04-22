import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root, { loader as rootLoader } from "./routes/root";
import Date, { loader as dateLoader } from "./routes/date";
import EditGoal, {
  action as editGoalAction,
  dateLoader as editGoalDateLoader,
  loader as editGoalLoader,
} from "./routes/editGoals";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
  },
  {
    path: "date/:dateId",
    element: <Date />,
    loader: dateLoader,
  },
  {
    path: "date/:dateId/goal",
    element: <EditGoal />,
    action: editGoalAction,
    loader: editGoalDateLoader,
  },
  {
    path: "goal",
    element: <EditGoal />,
    action: editGoalAction,
    loader: editGoalLoader,
  },
]);

export default function App() {
  return (
    <div className="flex justify-center items-center flex-col m-4">
      <RouterProvider router={router} />
    </div>
  );
}
