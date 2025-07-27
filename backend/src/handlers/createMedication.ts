import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Medication } from '../../../types';
import { logger } from '../utils/logger';

const db = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    logger.info('Creating new medication entry');

    const data = JSON.parse(event.body || '{}');
    const id = uuidv4();

    const medication: Medication = {
      id,
      name: data.name,
      scheduleType: data.scheduleType,
      times: data.times,
      daysOfWeek: data.daysOfWeek || [],
      isActive: true,
      takenLog: [],
    };

    await db.put({
      TableName: process.env.DYNAMO_TABLE!,
      Item: medication,
    }).promise();

    logger.info('Medication created successfully', { id });

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(medication),
    };
  } catch (err) {
    logger.error(`Create medication failed: ${err.message}`, {
        error: err,
        stack: err.stack,
      });
      
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Could not create medication', details: err }),
      };
  }
};
