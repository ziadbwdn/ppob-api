const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const { authenticateToken } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const { 
  validate, 
  registrationSchema, 
  loginSchema, 
  profileUpdateSchema 
} = require('../middleware/validation');

// POST /registration
router.post('/registration', 
  validate(registrationSchema),
  membershipController.register
);

// POST /login
router.post('/login', 
  validate(loginSchema),
  membershipController.login
);

// GET /profile
router.get('/profile', 
  authenticateToken,
  membershipController.getProfile
);

// PUT /profile/update
router.put('/profile/update', 
  authenticateToken,
  validate(profileUpdateSchema),
  membershipController.updateProfile
);

// PUT /profile/image
router.put('/profile/image', 
  authenticateToken,
  upload.single('file'),
  handleUploadError,
  membershipController.updateProfileImage
);

module.exports = router;