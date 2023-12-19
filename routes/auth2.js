const { register2, auth2 } = require('../controllers/auth2');
const router = require('express').Router();

router.post('/register2', register2);
router.post('/auth2', auth2);

module.exports = router;
