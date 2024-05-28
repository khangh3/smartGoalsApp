import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./routes/root";
import Date, { loader as dateLoader } from "./routes/date";
import CreateGoal, {
  loader as createGoalLoader,
  action as createGoalAction,
} from "./routes/createGoals";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/dates/:dateId",
    element: <Date />,
    loader: dateLoader,
  },
  {
    path: "/dates/:dateId/createGoal",
    element: <CreateGoal />,
    loader: createGoalLoader,
    action: createGoalAction,
  },
  {
    path: "/createGoal",
    element: <CreateGoal />,
    loader: createGoalLoader,
    action: createGoalAction,
  },
]);

function App() {
  return (
    <div className="flex flex-col p-4 items-center">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
