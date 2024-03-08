import * as express from "express"
import ThreadController from "../controllers/ThreadController"
import UserController from "../controllers/UserController"
import ReplyController from "../controllers/ReplyController"
import LikeController from "../controllers/LikeController"
import AuthController from "../controllers/AuthController"
import AuthentificationMiddlewares from "../middlewares/Auth"
import UploadImage from "../middlewares/UploadFile"
import FollowController from "../controllers/FollowController"

const router = express.Router()
const Auth = AuthentificationMiddlewares.Authentification

//thread
router.get("/threads", ThreadController.get)
router.post("/thread", Auth, UploadImage.single("image"), ThreadController.create)
router.get("/thread/:id", ThreadController.getId)
router.patch("/thread/:id", ThreadController.update)
router.delete("/thread/:id", ThreadController.delete)

//user
router.get("/users", UserController.get)
router.get("/user", Auth, UserController.getId)
router.post("/user", UserController.create)
router.patch("/user", Auth, UploadImage.single("profile_picture"), UserController.update)
router.delete("/user/:id", UserController.delete)

//follow
router.post("/follow", Auth, FollowController.followUser)
router.get("/following", Auth, FollowController.getFollowingUsers)
router.get("/follower", Auth, FollowController.getFollowerUsers)

//reply
router.get("/replies", ReplyController.get)
router.post("/reply", Auth, UploadImage.single("image"), ReplyController.create)
router.get("/reply/:id", ReplyController.getId)
router.patch("/reply/:id", ReplyController.update)
router.delete("/reply/:id", ReplyController.delete)

//like
router.get("/likes", LikeController.get)
router.get("/like/:id", LikeController.getId)
router.post("/like", Auth, LikeController.create)
router.patch("/like/:id", LikeController.update)
router.delete("/like/:id", LikeController.delete)

//auth
router.post("/register", AuthController.register)
router.post("/login", AuthController.login)
router.get("/check", AuthentificationMiddlewares.Authentification, AuthController.check)

export default router