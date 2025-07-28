import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { DynamoDB } from "aws-sdk";
import type { User } from '../../../types';

const db = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const id = uuidv4();

    const user: User = {
      id,
      name: body.name,
      email: body.email,
      image: body.image || null,
    };

    await db
      .put({
        TableName: process.env.USERS_TABLE!,
        Item: user,
      })
      .promise();

    return {
      statusCode: 201,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(user),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Could not create user" }),
    };
  }
};
