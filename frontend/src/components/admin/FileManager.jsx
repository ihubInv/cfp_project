"use client"

import { useState } from "react"
import {
    useGetProjectFilesQuery,
    useUploadProjectFilesMutation,
    useDeleteFileMutation,
    useDownloadFileMutation,
} from "../../store/api/fileApi"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Alert, AlertDescription } from "../ui/alert"
import FileUpload from "../ui/file-upload"
import { Download, Trash2, Upload, File, FileText, ImageIcon, AlertCircle } from "lucide-react"

const FileManager = ({ projectId, projectTitle }) => {
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState([])
    const [uploadError, setUploadError] = useState("")

    const { data: filesData, isLoading, error } = useGetProjectFilesQuery(projectId)
    const [uploadFiles, { isLoading: isUploading }] = useUploadProjectFilesMutation()
    const [deleteFile, { isLoading: isDeleting }] = useDeleteFileMutation()
    const [downloadFile] = useDownloadFileMutation()

    // Debug logging
    console.log("FileManager - projectId:", projectId)
    console.log("FileManager - filesData:", filesData)
    console.log("FileManager - isLoading:", isLoading)
    console.log("FileManager - error:", error)
    console.log("FileManager - API URL:", process.env.REACT_APP_API_URL || "http://localhost:5000/api")

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setUploadError("Please select files to upload")
            return
        }

        try {
            await uploadFiles({ projectId, files: selectedFiles }).unwrap()
            setUploadDialogOpen(false)
            setSelectedFiles([])
            setUploadError("")
        } catch (error) {
            setUploadError(error?.data?.message || "Upload failed. Please try again.")
        }
    }

    const handleDownload = async (filename, originalName) => {
        try {
            const blob = await downloadFile({ projectId, filename }).unwrap()

            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = originalName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Download failed:", error)
        }
    }

    const handleDelete = async (filename, originalName) => {
        if (window.confirm(`Are you sure you want to delete "${originalName}"?`)) {
            try {
                await deleteFile({ projectId, filename }).unwrap()
            } catch (error) {
                console.error("Delete failed:", error)
            }
        }
    }

    const getFileIcon = (mimetype) => {
        if (mimetype.startsWith("image/")) {
            return <ImageIcon className="h-5 w-5 text-blue-500" />
        } else if (mimetype === "application/pdf") {
            return <FileText className="h-5 w-5 text-red-500" />
        } else {
            return <File className="h-5 w-5 text-gray-500" />
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    const getFileTypeBadge = (mimetype) => {
        if (mimetype === "application/pdf") return "PDF"
        if (mimetype.includes("word")) return "DOC"
        if (mimetype === "text/plain") return "TXT"
        if (mimetype.startsWith("image/")) return "IMG"
        return "FILE"
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Project Files</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading files...</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Project Files</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Error loading files: {error?.data?.message || error?.message || "Unknown error"}
                        </AlertDescription>
                    </Alert>
                    <div className="mt-4">
                        <Button 
                            variant="outline" 
                            onClick={() => window.location.reload()}
                            className="mr-2"
                        >
                            Refresh Page
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={() => console.log("Full error details:", error)}
                        >
                            Show Debug Info
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Project Files</CardTitle>
                        <CardDescription>{projectTitle && `Files for: ${projectTitle}`}</CardDescription>
                    </div>
                    <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Files
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Upload Project Files</DialogTitle>
                                <DialogDescription>
                                    Upload documents, reports, and other files related to this project.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                {uploadError && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{uploadError}</AlertDescription>
                                    </Alert>
                                )}

                                <FileUpload onFilesSelected={setSelectedFiles} maxFiles={5} disabled={isUploading} />

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setUploadDialogOpen(false)
                                            setSelectedFiles([])
                                            setUploadError("")
                                        }}
                                        disabled={isUploading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleUpload} disabled={isUploading || selectedFiles.length === 0}>
                                        {isUploading ? "Uploading..." : "Upload Files"}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                {filesData?.files?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <File className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No files uploaded yet</p>
                        <p className="text-sm">Upload documents, reports, and other project files</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filesData?.files?.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    {getFileIcon(file.mimetype)}
                                    <div>
                                        <p className="font-medium">{file.originalName}</p>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <Badge variant="outline" className="text-xs">
                                                {getFileTypeBadge(file.mimetype)}
                                            </Badge>
                                            <span>{formatFileSize(file.size)}</span>
                                            <span>•</span>
                                            <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleDownload(file.filename, file.originalName)}>
                                        <Download className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(file.filename, file.originalName)}
                                        disabled={isDeleting}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default FileManager
