const express=require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { getDonarListController, getHospitalListController, getOrgListController, deleteDonarController } = require('../controllers/adminController')
const adminMiddleware = require('../middleware/adminMiddleware')
const router = express.Router()
//Routes

//get  All the three List
router.get('/donar-list',authMiddleware,adminMiddleware,getDonarListController)
router.get('/hospital-list',authMiddleware,adminMiddleware,getHospitalListController)
router.get('/org-list',authMiddleware,adminMiddleware,getOrgListController)

//Delete Donar
router.delete('/delete-donar/:id',authMiddleware,adminMiddleware,deleteDonarController)
router.delete('/delete-hospital/:id',authMiddleware,adminMiddleware,deleteDonarController)
router.delete('/delete-org/:id',authMiddleware,adminMiddleware,deleteDonarController)
module.exports=router