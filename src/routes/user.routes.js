import { Router } from 'express';
import { verifyJWT } from "../middlewares/auth.midlleware.js";
import { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar
} from "../controllers/user.controller.js";
import multerMiddleware from '../middlewares/multer.middleware.js';

const router = new Router();

router.route("/register").post(
    multerMiddleware.fields([
        {name: "avatar", maxCount: 1},
    ]),
    registerUser);

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, multerMiddleware.single("avatar"), updateUserAvatar)

export default router;