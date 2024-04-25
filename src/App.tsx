import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./routes/root";
import Date, { loader as dateLoader } from "./routes/date";
import EditGoals, { loader as editLoader } from "./routes/edit";

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
    path: "/dates/:dateId/editGoals",
    element: <EditGoals />,
    loader: editLoader,
  },
  {
    path: "/editGoals",
    element: <EditGoals />,
    loader: editLoader,
  },
]);

function App() {
  return (
    <div className="flex flex-col p-4 justify-center items-center">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
