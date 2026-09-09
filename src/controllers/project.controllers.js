import { User } from "../models/user.models.js";
import { project, Project } from "../models/project.models.js";
import { projectMember } from "../models/projectmember.models.js";
// utils
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { projectAddedMailGeneratorContent, sendEmail } from "../utils/mail.js";

// create
import mongoose, { mongo } from "mongoose";
import { UserRolesEnum } from "../utils/constants.js";

const getProjectsOfUser = asyncHandler(async (req, res) => {
  //test
});
const getProjectId = asyncHandler(async (req, res) => {
  //test
});
const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const newProject = await Project.create({
    name,
    description,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });
  await projectMember.create({
    user: new mongoose.Types.ObjectId(req.user._id),
    project: new mongoose.Types.ObjectId(newProject._id),
    role: UserRolesEnum.ADMIN,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Project created Successfully", project));
});
const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const { projectId } = req.params;
  const project = await Project.findByIdAndUpdate(
    projectId,
    {
      name,
      description,
    },
    { new: true },
  );
  if (!project) {
    throw new ApiError(404, "Project Not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Project Updated Successfully", project));
});
const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findByIdAndDelete(projectId);
  if (!project) {
    throw new ApiError(404, "Project Not Found");
  }

  // remove members?
  await projectMember.deleteMany({
    project: projectId,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Project Deleted Successfully", project));
});
const getProjectMembers = asyncHandler(async (req, res) => {
  //test
});
const addMemberInProject = asyncHandler(async (req, res) => {
  //test
});
const updateMemberRole = asyncHandler(async (req, res) => {
  //test
});
const deleteMember = asyncHandler(async (req, res) => {
  //test
});

export {
  getProjectsOfUser,
  getProjectId,
  createProject,
  updateProject,
  deleteProject,
  getProjectMembers,
  addMemberInProject,
  updateMemberRole,
  deleteMember,
};
