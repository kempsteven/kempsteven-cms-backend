const express = require('express')
const router = express.Router()
const DashboardController = require('../controllers/dashboard')

// middleware for token auth
const tokenAuth = require('../middleware/token-auth')

router.get(
    '/getDashboardData',
    tokenAuth,
    DashboardController.get_dashboard_data
)

module.exports = router