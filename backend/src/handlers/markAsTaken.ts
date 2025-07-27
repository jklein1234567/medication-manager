import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import moment from "moment";
import { logger } from "../utils/logger"; // adjust path if needed

const client = new DynamoDBClient({ region: "us-east-1" });

export const handler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id;
  const today = moment().format("YYYY-MM-DD");

  if (!id) {
    logger.warn("No ID provided in pathParameters");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing ID" }),
    };
  }

  logger.info("Marking medication as taken", { id, date: today });

  const command = new UpdateItemCommand({
    TableName: process.env.DYNAMO_TABLE,
    Key: marshall({ id }),
    UpdateExpression:
      "SET takenLog = list_append(if_not_exists(takenLog, :empty), :today)",
    ExpressionAttributeValues: marshall({
      ":today": [today],
      ":empty": [],
    }),
  });

  try {
    await client.send(command);
    logger.info("Successfully updated takenLog", { id });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Successfully marked as taken" }),
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
