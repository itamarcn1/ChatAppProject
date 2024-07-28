const express = require('express')
const {registerUser, authUser, allUsers, getUserProfile, updateUserProfile, changeUserPassword} = require('../controllers/userControllers')
const {checkToken} = require('../middlewares/authMiddleware')
const router = express.Router()

router.route('/').post(registerUser).get(checkToken,allUsers)
router.post('/login',authUser)
router.route('/profile').get(checkToken, getUserProfile).put(checkToken, updateUserProfile);
router.route('/profile/password').put(checkToken, changeUserPassword);

module.exports = router