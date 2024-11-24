const express = require('express');
const { createEmailController } = require('../controllers/emailController');

const router = express.Router();
const emailController = createEmailController();

router.get('/fetch-new', emailController.fetchNewEmails);
router.get('/', emailController.getEmails);

module.exports = router;
