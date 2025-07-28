import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const db = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
    const id = event.pathParameters?.id;
  
    if (!id) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "User ID is required" }),
      };
    }
  
    try {
      const result = await db
        .get({
          TableName: process.env.USERS_TABLE!,
          Key: { id },
        })
        .promise();
  
      return {
        statusCode: result.Item ? 200 : 404,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(result.Item || { error: "User not found" }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Could not fetch user" }),
      };
    }
  };
  