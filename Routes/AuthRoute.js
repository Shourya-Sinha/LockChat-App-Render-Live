import { Router } from "express";
import { addProfileImage, getUserInfo, login, logout, removeProfileImage, signup, updateProfile } from "../Controllers/AuthController.js";
import { verifyToken } from "../Middlewares/AuthMiddleWare.js";
import multer from "multer";

const upload = multer({dest:'uploads/profiles/'});

const router = Router();

router.post('/signup',signup);
router.post('/login',login);
router.get('/userInfo',verifyToken,getUserInfo);
router.post('/update-profile',verifyToken,updateProfile);
router.post('/add-profile-image',verifyToken,upload.single('profile-image'),addProfileImage);
router.delete('/remove-profile-image',verifyToken,removeProfileImage);
router.post('/logout',logout);

export default router;