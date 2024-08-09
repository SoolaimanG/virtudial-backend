import { PhoneNumberModel } from "./../models/index";
import {
  closeConnection,
  httpStatusResponse,
  openConnectionPool,
} from "./../helpers/index";
import express from "express";

export const getUsaStates = async (
  _: express.Request,
  res: express.Response
) => {
  try {
    await openConnectionPool();

    const states = await PhoneNumberModel.aggregate([
      {
        $match: { type: "usa-special-numbers" },
      },
      {
        $group: {
          _id: { state: "$state", areaCode: "$areaCode" },
          availableNumbers: { $sum: 1 },
          updatedAt: { $max: "$createdAt" },
        },
      },
      {
        $project: {
          _id: "$_id.state",
          state: "$_id.state",
          availableNumbers: 1,
          areaCode: "$_id.areaCode",
          updatedAt: 1,
        },
      },
    ]);

    await closeConnection();

    return res.status(200).json(httpStatusResponse(200, "", states));
  } catch (error) {
    await closeConnection();
    console.log(error);
    return res
      .status(500)
      .json(httpStatusResponse(500, "", error.message || "An error occurred"));
  }
};
