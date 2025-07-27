import { APIGatewayProxyHandler } from "aws-lambda";
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { logger } from "../utils/logger";

const client = new DynamoDBClient({ region: "us-east-1" });

export const handler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id;

  if (!id) {
    logger.warn("Toggle failed: Missing ID in pathParameters");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing ID" }),
    };
  }

  try {
    // 1. Get current item
    const getCmd = new GetItemCommand({
      TableName: process.env.DYNAMO_TABLE,
      Key: marshall({ id }),
    });

    const result = await client.send(getCmd);

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Medication not found" }),
      };
    }

    const med = unmarshall(result.Item);
    const newIsActive = !med.isActive;

    // 2. Update with flipped isActive
    const updateCmd = new UpdateItemCommand({
      TableName: process.env.DYNAMO_TABLE,
      Key: marshall({ id }),
      UpdateExpression: "SET isActive = :val",
      ExpressionAttributeValues: marshall({
        ":val": newIsActive,
      }),
    });

    logger.info("Toggling isActive", { id, newIsActive });

    await client.send(updateCmd);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Toggled isActive", isActive: newIsActive }),
    };
  } catch (error: any) {
    logger.error("Failed to toggle isActive", {
      error: error.message,
      stack: error.stack,
      id,
    });

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to toggle isActive" }),
    };
  }
};
