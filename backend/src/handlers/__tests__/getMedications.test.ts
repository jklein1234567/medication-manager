import { handler } from '../getMedications';
import { APIGatewayProxyEvent, Context, Callback, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

// Dummy inputs for handler
const dummyEvent = {} as APIGatewayProxyEvent;
const dummyContext = {} as Context;
const dummyCallback: Callback = () => {};

// Sample data
const mockedItems = [
  {
    id: '1',
    name: 'Advil',
    scheduleType: 'daily',
    times: ['08:00'],
    isActive: true,
    takenLog: [],
  },
];

// 🧪 Mocks
jest.mock('aws-sdk', () => {
  const put = jest.fn().mockReturnThis();
  const scan = jest.fn().mockReturnThis();
  const promise = jest.fn();

  const mockDocClient = {
    scan,
    put,
    promise,
  };

  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mockDocClient),
    },
  };
});

describe('getMedications', () => {
  let docClient: any;

  beforeEach(() => {
    docClient = new DynamoDB.DocumentClient();
  });

  it('returns a list of medications', async () => {
    docClient.scan.mockReturnValueOnce({
      promise: () => Promise.resolve({ Items: mockedItems }),
    });

    const result = await handler(dummyEvent, dummyContext, dummyCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toEqual(mockedItems);
  });

  it('handles errors', async () => {
    docClient.scan.mockReturnValueOnce({
      promise: () => Promise.reject(new Error('Test error')),
    });

    const result = await handler(dummyEvent, dummyContext, dummyCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toEqual(500);
    expect(JSON.parse(result.body).message).toEqual('Internal server error');
  });
});
