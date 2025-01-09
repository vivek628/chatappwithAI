import {Router} from 'express'
import * as  projectController from '../controllers/project.controller.js'
import * as authMiddleWare from '../middleware/auth.middleware.js'

const router=Router()
router.post('/create', authMiddleWare.authUser, projectController.createProjet)
router.get('/all',authMiddleWare.authUser,projectController.getAllProject)
router.put('/add-user',authMiddleWare.authUser,projectController.addUserToProject)
router.get('/get-project/:projectId',authMiddleWare.authUser,projectController.getProjectById)
router.get('/getGroupmember/:projectId',authMiddleWare.authUser,projectController.getGroupMember)
export default router