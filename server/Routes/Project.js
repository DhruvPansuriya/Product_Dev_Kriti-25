import express from 'express';
import {
  createProject,
  getStyle,
  updateStyle,
  uploadFile,
  deleteAllFiles,
  updateFile,
  getFiles,
  checkFileExists,
  deleteFile,
  updateProjectStyleChanges,
  getProjectStyleChanges
} from '../Controller/Project.js';

const router = express.Router();

// Route to create a project with files
router.post('/create-project', createProject);

// Route to get the style JSON file for a project
router.get('/getStyle', getStyle);

// Route to update the style JSON file for a project
router.put('/updateStyle', updateStyle);

// Route to upload a file to a project
router.post('/uploadFile', uploadFile);

// Route to update a specific file in a project
router.put('/updateFile', updateFile);

// Route to update a specific file in a project
router.get('/getAllFiles', getFiles);

// Route to delete all files in a project
router.delete('/deleteAllFiles', deleteAllFiles);

// Route to check if a file exists in a project
router.get('/checkFileExists', checkFileExists);

// Route to delete a specific file in a project
router.delete('/deleteFile', deleteFile);

// Route to update styleChanges in a project
router.put('/save-style', updateProjectStyleChanges);

// Route to get styleChanges from a project
router.get('/get-style', getProjectStyleChanges);

export default router;
