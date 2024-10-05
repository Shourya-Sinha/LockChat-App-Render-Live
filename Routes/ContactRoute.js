
import { Router } from "express";
import { verifyToken } from "../Middlewares/AuthMiddleWare.js";
import { getAllContacts, getContactsForDMList, searchContacts } from "../Controllers/ContactsController.js";

const router = Router();

router.post('/search',verifyToken,searchContacts);
router.get('/get-contacts-for-dm',verifyToken,getContactsForDMList);
router.get('/get-all-contacts',verifyToken,getAllContacts);

export default router;