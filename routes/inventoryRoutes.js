const express=require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { createInventoryController, getInventoryController, getDonarsController, getHospitalsController,getOrganisationsController, getOrganisationsForHospitalController, getInventoryHospitalController, getRecentInventoryController } = require('../controllers/inventoryController')
const router=express.Router()
//routes
router.post('/create-inventory',authMiddleware,createInventoryController)
//get all blood records
router.get('/get-inventory',authMiddleware,getInventoryController)
//get recent inventory
router.get('/get-recent-inventory',authMiddleware,getRecentInventoryController)
//get all hospital blood records
router.post('/get-inventory-hospital',authMiddleware,getInventoryHospitalController)
//get donar records
router.get('/get-donars',authMiddleware,getDonarsController)
//get hospital record
router.get('/get-hospitals',authMiddleware,getHospitalsController)
//get organisation record
router.get('/get-organisations',authMiddleware,getOrganisationsController)
//get organisation for hospital record
router.get('/get-organisations-for-hospital',authMiddleware,getOrganisationsForHospitalController)
module.exports=router