import { Router } from "express";
import { verifyToken } from "../Middlewares/AuthMiddleWare.js";
import { createChannel, getChannelMessage, getUserChannel } from "../Controllers/ChannelController.js";


const router = Router();

router.post('/create-channel',verifyToken,createChannel);
router.get('/get-user-channels',verifyToken,getUserChannel);
router.get('/get-channel-messages/:channelId',verifyToken,getChannelMessage);

export default router;