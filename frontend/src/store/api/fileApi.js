import { apiSlice } from "./apiSlice"

export const fileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadProjectFiles: builder.mutation({
      query: ({ projectId, files }) => {
        const formData = new FormData()
        files.forEach((file) => {
          formData.append("files", file)
        })

        return {
          url: `/files/projects/${projectId}/upload`,
          method: "POST",
          body: formData,
        }
      },
      invalidatesTags: ["Project"],
    }),
    getProjectFiles: builder.query({
      query: (projectId) => `/files/projects/${projectId}`,
      providesTags: (result, error, projectId) => [{ type: "Project", id: projectId }],
    }),
    downloadFile: builder.mutation({
      query: ({ projectId, filename }) => ({
        url: `/files/projects/${projectId}/download/${filename}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
    deleteFile: builder.mutation({
      query: ({ projectId, filename }) => ({
        url: `/files/projects/${projectId}/${filename}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),
  }),
})

export const {
  useUploadProjectFilesMutation,
  useGetProjectFilesQuery,
  useDownloadFileMutation,
  useDeleteFileMutation,
} = fileApi
