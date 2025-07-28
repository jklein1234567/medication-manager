import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { logger } from "../utils/logger";

const db = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  const userId = event.queryStringParameters?.userId;

  if (!userId) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Missing userId" }),
    };
  }

  try {
    logger.info(`Fetching medications for user: ${userId}`);
    const result = await db
      .query({
        TableName: process.env.DYNAMO_TABLE!,
        IndexName: "userId-index",
        KeyConditionExpression: "userId = :uid",
        ExpressionAttributeValues: {
          ":uid": userId,
        },
      })
      .promise();
    logger.info("Fetched medications count", { count: result.Items?.length });

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(result.Items),
    };
  } catch (err: any) {
    logger.error("getMedications error", { message: err.message });
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
