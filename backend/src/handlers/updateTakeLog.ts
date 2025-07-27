import { APIGatewayProxyHandler } from "aws-lambda";
import {
  DynamoDBClient,
  UpdateItemCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { logger } from "../utils/logger";

const client = new DynamoDBClient({ region: "us-east-1" });

export const handler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id;

  if (!id) {
    logger.warn("No ID provided in pathParameters");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing ID" }),
    };
  }

  let dateToToggle: string;

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    dateToToggle = body.date;

    if (!dateToToggle || typeof dateToToggle !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing or invalid 'date' in body" }),
      };
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  try {
    const getCommand = new GetItemCommand({
      TableName: process.env.DYNAMO_TABLE,
      Key: marshall({ id }),
    });

    const getResult = await client.send(getCommand);
    const item = getResult.Item ? unmarshall(getResult.Item) : null;

    if (!item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Medication not found" }),
      };
    }

    const takenLog: string[] = item.takenLog || [];
    const exists = takenLog.includes(dateToToggle);

    const updatedLog = exists
      ? takenLog.filter((d) => d !== dateToToggle)
      : [...takenLog, dateToToggle];

    const updateCommand = new UpdateItemCommand({
      TableName: process.env.DYNAMO_TABLE,
      Key: marshall({ id }),
      UpdateExpression: "SET takenLog = :log",
      ExpressionAttributeValues: marshall({
        ":log": updatedLog,
      }),
    });

    await client.send(updateCommand);

    logger.info("Updated takenLog", { id, updatedLog });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: exists ? "Marked as not taken" : "Marked as taken",
        date: dateToToggle,
      }),
    };
  } catch (error: any) {
    logger.error("Failed to update takenLog", {
      error: error.message,
      stack: error.stack,
    });

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to update takenLog" }),
    };
  }
};
