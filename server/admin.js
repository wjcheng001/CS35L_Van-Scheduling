const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


router.get('/applications', adminController.getAllApplications);


router.post('/approve/:userId', adminController.approveUser);

module.exports = router;
