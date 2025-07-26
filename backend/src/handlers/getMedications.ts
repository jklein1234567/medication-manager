import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { logger } from "../utils/logger";

const db = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async () => {
  try {
    logger.info("Fetching medications from DynamoDB");

    const result = await db
      .scan({
        TableName: process.env.DYNAMO_TABLE!,
      })
      .promise();

    logger.info("Fetched medications count", { count: result.Items?.length });

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (err) {
    logger.error(`Create medication failed: ${err.message}`, {
      error: err,
      stack: err.stack,
    });

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error", details: err }),
    };
  }
};
