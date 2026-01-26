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
    uploadPatentDocuments: builder.mutation({
      query: ({ projectId, files, patentIndex = null }) => {
        const formData = new FormData()
        files.forEach((file) => {
          formData.append("files", file)
        })

        let url = `/files/projects/${projectId}/patent/upload`
        if (patentIndex !== null && patentIndex !== undefined) {
          url += `?patentIndex=${patentIndex}`
        }

        return {
          url,
          method: "POST",
          body: formData,
        }
      },
      invalidatesTags: (result, error, { projectId }) => {
        if (!projectId) return ["Project"]
        return [
          { type: "Project", id: projectId },
          "Project", // Also invalidate the list query
        ]
      },
    }),
    deletePatentDocument: builder.mutation({
      query: ({ projectId, filename }) => ({
        url: `/files/projects/${projectId}/patent/${filename}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => {
        if (!projectId) return ["Project"]
        return [
          { type: "Project", id: projectId },
          "Project", // Also invalidate the list query
        ]
      },
    }),
    downloadPatentDocument: builder.mutation({
      query: ({ projectId, filename }) => ({
        url: `/files/projects/${projectId}/patent/${filename}/download`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
})

export const {
  useUploadProjectFilesMutation,
  useGetProjectFilesQuery,
  useDownloadFileMutation,
  useDeleteFileMutation,
  useUploadPatentDocumentsMutation,
  useDeletePatentDocumentMutation,
  useDownloadPatentDocumentMutation,
} = fileApi
