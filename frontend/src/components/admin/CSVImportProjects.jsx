"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Alert, AlertDescription } from "../ui/alert"
import { Progress } from "../ui/progress"
import { Badge } from "../ui/badge"
import { Upload, Download, FileText, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"
import { useCreateProjectMutation } from "../../store/api/adminApi"
import Papa from "papaparse"

const CSVImportProjects = ({ onClose, onSuccess }) => {
  const [csvFile, setCsvFile] = useState(null)
  const [csvData, setCsvData] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState({ success: 0, errors: 0, details: [] })
  const [showPreview, setShowPreview] = useState(false)
  
  const [createProject] = useCreateProjectMutation()

  // Simple CSV template for basic project creation
  const simpleCSV = `title,fileNumber,discipline,scheme,projectSummary,status,piName,piDesignation,piEmail,piInstitute,piDepartment,piAddress,totalAmount,sanctionYear,sanctionDate,patentDetail
"AI Research Project","AI-2024-001","Artificial Intelligence","CfP-4.0","Research on AI applications for healthcare","Ongoing","Dr. John Doe","Professor","john@example.com","IIT Mandi","Computer Science","Mandi Himachal Pradesh",500000,2024,"2024-01-15","AI-based diagnostic system patent filed"
"Blockchain Study","BLK-2024-002","Blockchain Technology","CfP-3.0","Blockchain research for supply chain","Pending","Dr. Alice Johnson","Professor","alice@example.com","IIT Bombay","Computer Science","Mumbai Maharashtra",750000,2024,"2024-02-01","Blockchain security protocol patent pending"`

  // Comprehensive CSV template with ALL available fields
  const comprehensiveCSV = `title,fileNumber,discipline,scheme,projectSummary,status,piName,piDesignation,piEmail,piInstitute,piDepartment,piAddress,coPiName,coPiDesignation,coPiEmail,coPiInstitute,coPiDepartment,coPiAddress,equipment1Name,equipment1Make,equipment1Model,equipment1Price,equipment2Name,equipment2Make,equipment2Model,equipment2Price,manpower1Type,manpower1Number,manpower2Type,manpower2Number,publication1Name,publication1Detail,publication1Status,publication2Name,publication2Detail,publication2Status,totalAmount,sanctionYear,sanctionDate,patentDetail
"AI Research Project","AI-2024-001","Artificial Intelligence","CfP-4.0","Research on AI applications for healthcare","Ongoing","Dr. John Doe","Professor","john@example.com","IIT Mandi","Computer Science","Mandi Himachal Pradesh","Dr. Jane Smith","Associate Professor","jane@example.com","IIT Delhi","Information Technology","Delhi India","GPU Server","NVIDIA","RTX 4090",150000,"High Performance Computer","Dell","PowerEdge R750",200000,"Research Scholar",2,"Post Doctoral Fellow",1,"AI in Healthcare","Published in IEEE Journal","Published","Machine Learning Applications","Under Review","Under Review",500000,2024,"2024-01-15","AI-based diagnostic system patent filed"
"Blockchain Study","BLK-2024-002","Blockchain Technology","CfP-3.0","Blockchain research for supply chain","Pending","Dr. Alice Johnson","Professor","alice@example.com","IIT Bombay","Computer Science","Mumbai Maharashtra","Dr. Bob Wilson","Assistant Professor","bob@example.com","IIT Madras","Information Technology","Chennai Tamil Nadu","Blockchain Node","IBM","Hyperledger Fabric",100000,"","","","","Research Scholar",1,"","","Blockchain Security","Published in ACM Conference","Published","","","","",750000,2024,"2024-02-01","Blockchain security protocol patent pending"`

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
      setCsvFile(file)
      parseCSV(file)
    } else {
      alert('Please select a valid CSV file')
    }
  }

  const parseCSV = (file) => {
    console.log('Starting CSV parsing for file:', file.name)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: ',',
      quoteChar: '"',
      escapeChar: '"',
      complete: (results) => {
        console.log('CSV parsing results:', results)
        console.log('Number of rows:', results.data.length)
        console.log('First row keys:', results.data.length > 0 ? Object.keys(results.data[0]) : 'No data')
        console.log('First row values:', results.data.length > 0 ? Object.values(results.data[0]) : 'No data')
        
        if (results.errors.length > 0) {
          console.error('CSV parsing errors:', results.errors)
          alert('Error parsing CSV: ' + results.errors[0].message)
          return
        }
        if (results.data.length === 0) {
          alert('No data found in CSV file')
          return
        }
        
        // Check if we have the expected number of fields
        const expectedFields = 40
        const actualFields = results.data.length > 0 ? Object.keys(results.data[0]).length : 0
        console.log(`Expected ${expectedFields} fields, got ${actualFields} fields`)
        
        if (actualFields < expectedFields) {
          console.warn(`Warning: Expected ${expectedFields} fields but got ${actualFields}`)
          console.log('Available fields:', Object.keys(results.data[0]))
        }
        
        setCsvData(results.data)
        setShowPreview(true)
      },
      error: (error) => {
        console.error('CSV parsing error:', error)
        alert('Error reading CSV file: ' + error.message)
      }
    })
  }

  const downloadSampleCSV = (template = 'simple') => {
    const csvContent = template === 'comprehensive' ? comprehensiveCSV : simpleCSV
    const filename = template === 'comprehensive' ? 'comprehensive_project_template.csv' : 'simple_project_template.csv'
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const validateProjectData = (row, index) => {
    const errors = []
    
    // Only validate format, not required fields - all fields are optional
    
    // Email format validation (if provided)
    if (row.piEmail && row.piEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.piEmail)) {
      errors.push('Invalid PI email format')
    }
    if (row.coPiEmail && row.coPiEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.coPiEmail)) {
      errors.push('Invalid Co-PI email format')
    }
    
    // Date format validation (if provided)
    if (row.sanctionDate && row.sanctionDate.trim() && isNaN(Date.parse(row.sanctionDate))) {
      errors.push('Invalid sanction date format')
    }
    
    // Budget amount validation (if provided, must be valid number)
    if (row.totalAmount && row.totalAmount.trim() && isNaN(parseFloat(row.totalAmount))) {
      errors.push('Total Amount must be a valid number if provided')
    }
    if (row.totalAmount && !isNaN(parseFloat(row.totalAmount)) && parseFloat(row.totalAmount) < 0) {
      errors.push('Total Amount must be a positive number if provided')
    }
    
    // Equipment validation - only validate if partial data is provided
    if (row.equipment1Name && row.equipment1Name.trim() && (!row.equipment1Price || isNaN(parseFloat(row.equipment1Price)))) {
      errors.push('Equipment 1: Price must be a valid number if equipment name is provided')
    }
    if (row.equipment2Name && row.equipment2Name.trim() && (!row.equipment2Price || isNaN(parseFloat(row.equipment2Price)))) {
      errors.push('Equipment 2: Price must be a valid number if equipment name is provided')
    }
    
    // Manpower validation - only validate if partial data is provided
    if (row.manpower1Type && row.manpower1Type.trim() && (!row.manpower1Number || isNaN(parseInt(row.manpower1Number)))) {
      errors.push('Manpower 1: Number must be a valid integer if manpower type is provided')
    }
    if (row.manpower2Type && row.manpower2Type.trim() && (!row.manpower2Number || isNaN(parseInt(row.manpower2Number)))) {
      errors.push('Manpower 2: Number must be a valid integer if manpower type is provided')
    }
    
    return errors
  }

  const processProjects = async () => {
    setIsProcessing(true)
    setProgress(0)
    setResults({ success: 0, errors: 0, details: [] })
    
    const totalProjects = csvData.length
    let successCount = 0
    let errorCount = 0
    const details = []
    
    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i]
      const rowNumber = i + 1
      
      // Validate data
      const validationErrors = validateProjectData(row, i)
      
      if (validationErrors.length > 0) {
        errorCount++
        details.push({
          row: rowNumber,
          title: row.title || 'Untitled',
          status: 'error',
          message: validationErrors.join(', ')
        })
      } else {
        try {
          // Transform CSV data to project format
          const projectData = {
            title: row.title?.trim(),
            fileNumber: row.fileNumber?.trim() || `PROJ-${Date.now()}-${i}`,
            discipline: row.discipline?.trim() || '',
            scheme: row.scheme?.trim() || '',
            projectSummary: row.projectSummary?.trim() || '',
            validationStatus: row.status?.trim() || 'Ongoing',
            principalInvestigators: row.piName?.trim() ? [{
              name: row.piName?.trim(),
              email: row.piEmail?.trim() || '',
              designation: row.piDesignation?.trim() || '',
              instituteName: row.piInstitute?.trim() || '',
              department: row.piDepartment?.trim() || '',
              instituteAddress: row.piAddress?.trim() || ''
            }] : [],
            coPrincipalInvestigators: row.coPiName?.trim() ? [{
              name: row.coPiName?.trim(),
              email: row.coPiEmail?.trim() || '',
              designation: row.coPiDesignation?.trim() || 'Professor',
              instituteName: row.coPiInstitute?.trim() || '',
              department: row.coPiDepartment?.trim() || '',
              instituteAddress: row.coPiAddress?.trim() || ''
            }] : [],
            equipmentSanctioned: [
              ...(row.equipment1Name?.trim() ? [{
                genericName: row.equipment1Name?.trim(),
                make: row.equipment1Make?.trim(),
                model: row.equipment1Model?.trim(),
                priceInr: parseFloat(row.equipment1Price) || 0
              }] : []),
              ...(row.equipment2Name?.trim() ? [{
                genericName: row.equipment2Name?.trim(),
                make: row.equipment2Make?.trim(),
                model: row.equipment2Model?.trim(),
                priceInr: parseFloat(row.equipment2Price) || 0
              }] : [])
            ],
            manpowerSanctioned: [
              ...(row.manpower1Type?.trim() ? [{
                manpowerType: row.manpower1Type?.trim(),
                number: parseInt(row.manpower1Number) || 0
              }] : []),
              ...(row.manpower2Type?.trim() ? [{
                manpowerType: row.manpower2Type?.trim(),
                number: parseInt(row.manpower2Number) || 0
              }] : [])
            ],
            publications: [
              ...(row.publication1Name?.trim() ? [{
                name: row.publication1Name?.trim(),
                publicationDetail: row.publication1Detail?.trim(),
                status: row.publication1Status?.trim()
              }] : []),
              ...(row.publication2Name?.trim() ? [{
                name: row.publication2Name?.trim(),
                publicationDetail: row.publication2Detail?.trim(),
                status: row.publication2Status?.trim()
              }] : [])
            ],
            budget: {
              totalAmount: row.totalAmount ? parseFloat(row.totalAmount) : 0,
              sanctionYear: row.sanctionYear ? parseInt(row.sanctionYear) : new Date().getFullYear(),
              date: row.sanctionDate || new Date().toISOString()
            },
            patentDetail: row.patentDetail?.trim() || ''
          }
          
          await createProject(projectData).unwrap()
          successCount++
          details.push({
            row: rowNumber,
            title: row.title,
            status: 'success',
            message: 'Project created successfully'
          })
          
        } catch (error) {
          errorCount++
          details.push({
            row: rowNumber,
            title: row.title || 'Untitled',
            status: 'error',
            message: error.data?.message || error.message || 'Failed to create project'
          })
        }
      }
      
      // Update progress
      setProgress(((i + 1) / totalProjects) * 100)
    }
    
    setResults({ success: successCount, errors: errorCount, details })
    setIsProcessing(false)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-xl">
                <FileText className="h-6 w-6 mr-2" />
                Import Projects from CSV
              </CardTitle>
              <CardDescription>
                Upload a CSV file to create multiple projects at once
              </CardDescription>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Instructions */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Instructions:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Download the sample CSV template to see the required format</li>
                  <li>Fill in your project data following the template structure</li>
                  <li>Upload the CSV file to import multiple projects</li>
                  <li>Review the preview before processing</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Download Templates */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => downloadSampleCSV('simple')} 
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Simple Template (16 fields)
              </Button>
              <Button 
                onClick={() => downloadSampleCSV('comprehensive')} 
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Full Template (40 fields)
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>Simple Template:</strong> Basic project fields for quick import</p>
              <p><strong>Full Template:</strong> All available fields including equipment, manpower, and publications</p>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="csv-file">Select CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isProcessing}
            />
          </div>

          {/* Preview */}
          {showPreview && csvData.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Preview ({csvData.length} projects)</h3>
                <Button onClick={processProjects} disabled={isProcessing}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Projects
                </Button>
              </div>
              
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">Row</th>
                      <th className="px-3 py-2 text-left">Title</th>
                      <th className="px-3 py-2 text-left">PI Name</th>
                      <th className="px-3 py-2 text-left">Institute</th>
                      <th className="px-3 py-2 text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 10).map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2">{row.title || 'N/A'}</td>
                        <td className="px-3 py-2">{row.piName || 'N/A'}</td>
                        <td className="px-3 py-2">{row.piInstitute || 'N/A'}</td>
                        <td className="px-3 py-2">{row.totalAmount || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {csvData.length > 10 && (
                  <div className="px-3 py-2 text-sm text-gray-500 bg-gray-50">
                    ... and {csvData.length - 10} more projects
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processing projects...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Results */}
          {results.details.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Badge className="bg-green-100 text-green-800">
                  Success: {results.success}
                </Badge>
                <Badge className="bg-red-100 text-red-800">
                  Errors: {results.errors}
                </Badge>
              </div>
              
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">Row</th>
                      <th className="px-3 py-2 text-left">Title</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-left">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.details.map((detail, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-3 py-2">{detail.row}</td>
                        <td className="px-3 py-2">{detail.title}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(detail.status)}
                            {getStatusBadge(detail.status)}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-xs">{detail.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                {results.success > 0 && (
                  <Button onClick={() => { onSuccess(); onClose(); }}>
                    View Projects
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CSVImportProjects
