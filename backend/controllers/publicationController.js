const Project = require("../models/Project")
const { createActivityLog } = require("./activityLogController")

// Get all publications from projects
const getPublications = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      type, 
      status,
      projectId 
    } = req.query

    // Build aggregation pipeline to extract publications from projects
    const pipeline = [
      // Match projects that have publications
      {
        $match: {
          publications: { $exists: true, $ne: [] }
        }
      },
      // Unwind publications array
      {
        $unwind: "$publications"
      },
      // Add project information to each publication
      {
        $addFields: {
          "publications.projectId": "$_id",
          "publications.projectTitle": "$title",
          "publications.projectFileNumber": "$fileNumber",
          "publications.projectDiscipline": "$discipline",
          "publications.projectScheme": "$scheme"
        }
      },
      // Replace root with publication data
      {
        $replaceRoot: { newRoot: "$publications" }
      }
    ]

    // Add search filter
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { publicationDetail: { $regex: search, $options: "i" } },
            { projectTitle: { $regex: search, $options: "i" } }
          ]
        }
      })
    }

    // Add status filter
    if (status && status !== "All Status") {
      pipeline.push({
        $match: { status: status }
      })
    }

    // Add project filter
    if (projectId) {
      pipeline.push({
        $match: { projectId: projectId }
      })
    }

    // Add pagination
    const skip = (page - 1) * limit
    pipeline.push(
      { $skip: skip },
      { $limit: parseInt(limit) },
      { $sort: { _id: -1 } }
    )

    // Execute aggregation
    const publications = await Project.aggregate(pipeline)

    // Get total count for pagination
    const countPipeline = [
      {
        $match: {
          publications: { $exists: true, $ne: [] }
        }
      },
      {
        $unwind: "$publications"
      },
      {
        $addFields: {
          "publications.projectId": "$_id",
          "publications.projectTitle": "$title"
        }
      },
      {
        $replaceRoot: { newRoot: "$publications" }
      }
    ]

    // Add same filters to count pipeline
    if (search) {
      countPipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { publicationDetail: { $regex: search, $options: "i" } },
            { projectTitle: { $regex: search, $options: "i" } }
          ]
        }
      })
    }

    if (status && status !== "All Status") {
      countPipeline.push({
        $match: { status: status }
      })
    }

    if (projectId) {
      countPipeline.push({
        $match: { projectId: projectId }
      })
    }

    const total = await Project.aggregate([...countPipeline, { $count: "total" }])
    const totalCount = total.length > 0 ? total[0].total : 0

    res.json({
      publications,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
      total: totalCount
    })
  } catch (error) {
    console.error("Error fetching publications:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get publication by ID
const getPublicationById = async (req, res) => {
  try {
    const { id } = req.params

    const project = await Project.findOne({
      "publications._id": id
    })

    if (!project) {
      return res.status(404).json({ message: "Publication not found" })
    }

    const publication = project.publications.find(pub => pub._id.toString() === id)
    
    if (!publication) {
      return res.status(404).json({ message: "Publication not found" })
    }

    // Add project information
    const publicationWithProject = {
      ...publication.toObject(),
      projectId: project._id,
      projectTitle: project.title,
      projectFileNumber: project.fileNumber,
      projectDiscipline: project.discipline,
      projectScheme: project.scheme
    }

    res.json(publicationWithProject)
  } catch (error) {
    console.error("Error fetching publication:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Create new publication (add to project)
const createPublication = async (req, res) => {
  try {
    const { projectId, name, publicationDetail, status } = req.body

    if (!projectId || !name || !publicationDetail || !status) {
      return res.status(400).json({ 
        message: "Project ID, name, publication detail, and status are required" 
      })
    }

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Add publication to project
    const newPublication = {
      name,
      publicationDetail,
      status
    }

    project.publications.push(newPublication)
    await project.save()

    // Get the newly created publication
    const createdPublication = project.publications[project.publications.length - 1]

    // Log activity
    await createActivityLog(
      req.user.id,
      "CREATE_PUBLICATION",
      "Publication",
      createdPublication._id,
      {
        description: `Added publication "${name}" to project "${project.title}"`,
        projectId: project._id,
        projectTitle: project.title
      },
      req
    )

    res.status(201).json({
      ...createdPublication.toObject(),
      projectId: project._id,
      projectTitle: project.title,
      projectFileNumber: project.fileNumber
    })
  } catch (error) {
    console.error("Error creating publication:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update publication
const updatePublication = async (req, res) => {
  try {
    const { id } = req.params
    const { name, publicationDetail, status } = req.body

    const project = await Project.findOne({
      "publications._id": id
    })

    if (!project) {
      return res.status(404).json({ message: "Publication not found" })
    }

    const publication = project.publications.find(pub => pub._id.toString() === id)
    if (!publication) {
      return res.status(404).json({ message: "Publication not found" })
    }

    // Update publication fields
    if (name) publication.name = name
    if (publicationDetail) publication.publicationDetail = publicationDetail
    if (status) publication.status = status

    await project.save()

    // Log activity
    await createActivityLog(
      req.user.id,
      "UPDATE_PUBLICATION",
      "Publication",
      publication._id,
      {
        description: `Updated publication "${publication.name}" in project "${project.title}"`,
        projectId: project._id,
        projectTitle: project.title
      },
      req
    )

    res.json({
      ...publication.toObject(),
      projectId: project._id,
      projectTitle: project.title,
      projectFileNumber: project.fileNumber
    })
  } catch (error) {
    console.error("Error updating publication:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Delete publication
const deletePublication = async (req, res) => {
  try {
    const { id } = req.params

    const project = await Project.findOne({
      "publications._id": id
    })

    if (!project) {
      return res.status(404).json({ message: "Publication not found" })
    }

    const publication = project.publications.find(pub => pub._id.toString() === id)
    if (!publication) {
      return res.status(404).json({ message: "Publication not found" })
    }

    // Log activity before deletion
    await createActivityLog(
      req.user.id,
      "DELETE_PUBLICATION",
      "Publication",
      publication._id,
      {
        description: `Deleted publication "${publication.name}" from project "${project.title}"`,
        projectId: project._id,
        projectTitle: project.title
      },
      req
    )

    // Remove publication from project
    project.publications = project.publications.filter(pub => pub._id.toString() !== id)
    await project.save()

    res.json({ message: "Publication deleted successfully" })
  } catch (error) {
    console.error("Error deleting publication:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get publication statistics
const getPublicationStats = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          publications: { $exists: true, $ne: [] }
        }
      },
      {
        $unwind: "$publications"
      },
      {
        $group: {
          _id: "$publications.status",
          count: { $sum: 1 }
        }
      }
    ]

    const stats = await Project.aggregate(pipeline)
    
    const result = {
      total: 0,
      published: 0,
      underReview: 0,
      submitted: 0,
      draft: 0
    }

    stats.forEach(stat => {
      result.total += stat.count
      const status = stat._id.toLowerCase().replace(/\s+/g, '')
      if (result.hasOwnProperty(status)) {
        result[status] = stat.count
      }
    })

    res.json({ stats: result })
  } catch (error) {
    console.error("Error fetching publication stats:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  getPublications,
  getPublicationById,
  createPublication,
  updatePublication,
  deletePublication,
  getPublicationStats
}
