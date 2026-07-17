const express = require('express');
const { getUsers, getUserById } = require('../controllers/userController');
const validate = require('../middleware/validate');
const { objectIdParam } = require('../middleware/validators');

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', objectIdParam('id'), validate, getUserById);

module.exports = router;
