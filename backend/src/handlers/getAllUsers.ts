import type { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const db = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async () => {
    try {
      const result = await db
        .scan({
          TableName: process.env.USERS_TABLE!,
        })
        .promise();
  
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(result.Items),
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Could not fetch users" }),
      };
    }
  };
  