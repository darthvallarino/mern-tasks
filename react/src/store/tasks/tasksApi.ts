import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export interface ITask {
  _id: string;
  title: string;
  status: string;
  user: {
    _id: string;
    nickname: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ICompletionTimeByUser {
  userId: string;
  userName: string;
  avgCompletionTime: string;
}

export interface ITasksByUser {
  userId: string;
  userName: string;
  count: number;
}

export interface IStatisticsData {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: string;
  avgCompletionTimeGlobal: string;
  completionTimeByUser: ICompletionTimeByUser[];
  tasksByUser: ITasksByUser[];
}

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API}`,
    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as RootState).auth.accessToken ||
        localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createTask: builder.mutation({
      query: (task) => ({
        url: "/tasks",
        method: "POST",
        body: task,
      }),
    }),
    getTasks: builder.query<ITask[], void>({
      query: () => "/tasks",
    }),
    updateTask: builder.mutation({
      query: (taskID) => ({
        url: `/tasks/${taskID}`,
        method: "PUT",
      }),
    }),
    getStats: builder.query<IStatisticsData, void>({
      query: () => "/tasks/stats",
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation,
  useGetStatsQuery,
} = tasksApi;
