import { getUsaStates } from "./../controllers/numbers";
import express from "express";

const numberRouter = express.Router();

numberRouter.get("/get-usa-states", getUsaStates);

export default (): express.Router => {
  return numberRouter;
};
