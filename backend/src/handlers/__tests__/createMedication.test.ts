import { handler } from '../createMedication';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const mockContext = {} as Context;
const mockCallback: Callback = () => {};

// Mock the DocumentClient manually
jest.mock('aws-sdk', () => {
  const mockPut = jest.fn().mockReturnThis();
  const mockPromise = jest.fn();

  const mockDocClient = {
    put: mockPut,
    promise: mockPromise,
  };

  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mockDocClient),
    },
  };
});

describe('createMedication handler', () => {
  const mockData = {
    name: 'Advil',
    scheduleType: 'daily',
    times: ['08:00'],
  };

  let docClient: any;

  beforeEach(() => {
    docClient = new DynamoDB.DocumentClient();
  });

  it('creates a medication and returns 201', async () => {
    docClient.put().promise.mockResolvedValueOnce({});

    const event = {
      body: JSON.stringify(mockData),
    } as APIGatewayProxyEvent;

    const result = await handler(event, mockContext, mockCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(201);
    const body = JSON.parse(result.body);
    expect(body.name).toBe('Advil');
  });

  it('handles DB errors', async () => {
    docClient.put().promise.mockRejectedValueOnce(new Error('DB failure'));

    const event = {
      body: JSON.stringify(mockData),
    } as APIGatewayProxyEvent;

    const result = await handler(event, mockContext, mockCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.error).toBe('Could not create medication');
  });
});
