import {
  AuthResponse,
  Project,
  SearchResults,
  Task,
  Team,
  User,
} from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams"],
  endpoints: (build) => ({
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],
    }),
    getTaskByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks", id: userId }],
    }),

    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
    // createUser: build.mutation<AuthResponse, {username: string, password: string, profilePicture: string}>({
    //   query: (user) => ({
    //     url: "auth/register",
    //     method: "POST",
    //     body: user
    //   }),
    //   invalidatesTags: ["Users"]
    // }),
    createUser: build.mutation<AuthResponse,FormData>({
      query: (formData) => ({
        url: "auth/register",
        method: "POST",
        // Don't set Content-Type header - it will be automatically set for FormData
        // with the correct boundary
        body: formData,
        // Prevent fetchBaseQuery from automatically serializing the FormData to JSON
        formData: true,
      }),
      invalidatesTags: ["Users"],
      // Transform the response to handle any additional processing
      transformResponse: (response: AuthResponse) => {
        console.log("User creation response:", {
          success: !!response.token,
          hasProfilePicture: !!response.profilePictureUrl,
        });
        return response;
      },

      transformErrorResponse: (response: { status: number; data: unknown }) => {
        console.error("User creation failed:", response);
        return {
          status: response.status,
          message: response.data?.message || "Registration failed",
        };
      },
    }),

    loginUser: build.mutation<AuthResponse,{ username: string; password: string }>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useSearchQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetTaskByUserQuery,
  useCreateUserMutation,
  useLoginUserMutation,
} = api;
