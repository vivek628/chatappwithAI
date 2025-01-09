import {Router} from 'express'
import * as aicontrollers from '../controllers/ai.controller.js'
const router=Router()
router.get('/get-result',aicontrollers.getResult)
export default router