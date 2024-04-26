// This will be used to create and update the goals object
// it will track all the users goals and tasks related to the goal
// upon syncing with the database, this goal object will be used
// to update the data inside the database
import localforage from "localforage";

type TaskDocument = {
  id: number;
  // parent: number | null; // rn just don't really see the use of parent
  children: TaskDocument[];
  objective: string;
  description: string;
  dates: number[];
  completionStatus: boolean[];
};
const goalObject: TaskDocument[] = [];
