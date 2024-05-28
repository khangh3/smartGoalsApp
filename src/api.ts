// This will be used to create and update the goals object
// it will track all the users goals and tasks related to the goal
// upon syncing with the database, this goal object will be used
// to update the data inside the database
export type TaskDocument = {
  id: string;
  // parent: number | null; // rn just don't really see the use of parent
  children: string[]; // contains id of children
  objective: string;
  description?: string;
  dates: Day[];
  completionStatus: boolean[];
};

export type GoalDocument = {
  tasks: TaskDocument[];
  root: string;
  startDate: number;
  endDate: number;
};

export type Task = {
  id: string;
  objective: string;
  description?: string;
  children: Task[];
  startDate: number;
  endDate?: number;
};

// array containing number of days in each month
export const MonthToDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const MonthsToNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export type Day = {
  day: number;
  month: number;
  year: number;
  currentMonth?: boolean;
};
