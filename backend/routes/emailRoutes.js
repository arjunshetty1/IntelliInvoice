const express = require('express');
const { createEmailController } = require('../controllers/emailController');

const router = express.Router();
const emailController = createEmailController();

router.get('/', emailController.getEmails);
router.get('/fetch-new', emailController.fetchNewEmails);

module.exports = router;
