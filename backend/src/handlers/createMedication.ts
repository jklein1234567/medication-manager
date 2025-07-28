import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Medication } from "../../../types";
import { logger } from "../utils/logger";

const db = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    logger.info("Creating new medication entry");

    const data = JSON.parse(event.body || "{}");
    const id = uuidv4();

    if (
      !data.name ||
      !data.scheduleType ||
      !data.times ||
      !data.purpose ||
      !data.type
    ) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const medication: Medication = {
      id,
      name: data.name,
      scheduleType: data.scheduleType,
      times: Number(data.times),
      isActive: true,
      takenLog: [],
      purpose: data.purpose,
      type: data.type,
    };

    // Add optional fields
    if (data.scheduleType === "weekly" && Array.isArray(data.daysOfWeek)) {
      medication.daysOfWeek = data.daysOfWeek;
    }

    if (data.scheduleType === "monthly" && data.dayOfMonth) {
      medication.dayOfMonth = data.dayOfMonth;
    }

    await db
      .put({
        TableName: process.env.DYNAMO_TABLE!,
        Item: medication,
      })
      .promise();

    logger.info("Medication created successfully", { id });

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(medication),
    };
  } catch (err: any) {
    logger.error(`Create medication failed: ${err.message}`, {
      error: err,
      stack: err.stack,
    });

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Could not create medication",
        details: err.message,
      }),
    };
  }
};
