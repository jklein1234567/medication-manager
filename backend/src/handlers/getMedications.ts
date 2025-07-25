// backend/src/handlers/getMedications.ts

import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const db = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const result = await db.scan({
      TableName: process.env.DYNAMO_TABLE!,
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (err) {
    console.error('Error in getMedications:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error', details: err }),
    };
  }
};
