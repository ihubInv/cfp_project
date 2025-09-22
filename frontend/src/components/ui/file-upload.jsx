"use client"

import { useState, useRef } from "react"
import { Button } from "./button"
import { Card, CardContent } from "./card"
import { Upload, X, File, FileText, ImageIcon, AlertCircle } from "lucide-react"

const FileUpload = ({
    onFilesSelected,
    maxFiles = 5,
    maxSize = 10 * 1024 * 1024, // 10MB
    acceptedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/jpeg",
        "image/png",
        "image/gif",
    ],
    disabled = false,
}) => {
    const [dragActive, setDragActive] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState([])
    const [errors, setErrors] = useState([])
    const fileInputRef = useRef(null)

    const validateFile = (file) => {
        const errors = []

        if (file.size > maxSize) {
            errors.push(`File "${file.name}" is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`)
        }

        if (!acceptedTypes.includes(file.type)) {
            errors.push(`File "${file.name}" has an unsupported format.`)
        }

        return errors
    }

    const handleFiles = (files) => {
        const fileArray = Array.from(files)
        const newErrors = []
        const validFiles = []

        if (fileArray.length + selectedFiles.length > maxFiles) {
            newErrors.push(`Cannot upload more than ${maxFiles} files.`)
            return
        }

        fileArray.forEach((file) => {
            const fileErrors = validateFile(file)
            if (fileErrors.length > 0) {
                newErrors.push(...fileErrors)
            } else {
                validFiles.push(file)
            }
        })

        setErrors(newErrors)

        if (validFiles.length > 0) {
            const updatedFiles = [...selectedFiles, ...validFiles]
            setSelectedFiles(updatedFiles)
            onFilesSelected(updatedFiles)
        }
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (disabled) return

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files)
        }
    }

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files)
        }
    }

    const removeFile = (index) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index)
        setSelectedFiles(updatedFiles)
        onFilesSelected(updatedFiles)
    }

    const getFileIcon = (file) => {
        if (file.type.startsWith("image/")) {
            return <ImageIcon className="h-4 w-4" />
        } else if (file.type === "application/pdf") {
            return <FileText className="h-4 w-4" />
        } else {
            return <File className="h-4 w-4" />
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <Card
                className={`border-2 border-dashed transition-colors ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !disabled && fileInputRef.current?.click()}
            >
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <Upload className={`h-8 w-8 mb-4 ${dragActive ? "text-blue-500" : "text-gray-400"}`} />
                    <p className="text-lg font-medium mb-2">{dragActive ? "Drop files here" : "Upload files"}</p>
                    <p className="text-sm text-gray-600 mb-4">Drag and drop files here, or click to select files</p>
                    <p className="text-xs text-gray-500">
                        Supports PDF, DOC, DOCX, TXT, and image files up to {Math.round(maxSize / 1024 / 1024)}MB
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept={acceptedTypes.join(",")}
                        onChange={handleFileInput}
                        className="hidden"
                        disabled={disabled}
                    />
                </CardContent>
            </Card>

            {/* Error Messages */}
            {errors.length > 0 && (
                <div className="space-y-2">
                    {errors.map((error, index) => (
                        <div key={index} className="flex items-center space-x-2 text-red-600 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <span>{error}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-medium text-sm">
                        Selected Files ({selectedFiles.length}/{maxFiles})
                    </h4>
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                {getFileIcon(file)}
                                <div>
                                    <p className="text-sm font-medium">{file.name}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeFile(index)} disabled={disabled}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default FileUpload
