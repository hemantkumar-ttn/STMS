const express = require('express');
const { addComment, getComments } = require('../controllers/commentController');
const validate = require('../middleware/validate');
const { createCommentRules, objectIdParam } = require('../middleware/validators');

const router = express.Router({ mergeParams: true });

router.get('/', objectIdParam('ticketId'), validate, getComments);
router.post('/', createCommentRules, validate, addComment);

module.exports = router;
