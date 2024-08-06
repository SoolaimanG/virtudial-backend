import { _joinNewsLetter, messageSupport } from "../controllers/index";
import express from "express";

const router = express.Router();

router.post("/join-wait-list", _joinNewsLetter);

router.post("/message-support", messageSupport);
//

export default (): express.Router => {
  return router;
};
