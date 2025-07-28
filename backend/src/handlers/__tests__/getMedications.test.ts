// mocking query before imports
const queryMock = jest.fn();

import { handler } from "../getMedications";
import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";


jest.mock("aws-sdk", () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        query: queryMock,
      })),
    },
  };
});

const dummyContext = {} as Context;

// Sample data
const mockedItems = [
  {
    name: "Advil",
    userId: "user-123",
    scheduleType: "daily",
    times: 1,
    daysOfWeek: [],
    isActive: true,
    takenLog: [],
    purpose: "Pain relief",
    type: "OTC",
  },
];

describe("getMedications", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns a list of medications", async () => {
    queryMock.mockReturnValueOnce({
      promise: () => Promise.resolve({ Items: mockedItems }),
    });

    const event = {
      queryStringParameters: { userId: "user-123" },
    } as unknown as APIGatewayProxyEvent;

    const result = (await handler(
      event,
      dummyContext,
      undefined
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toEqual(mockedItems);
  });

  it("handles errors", async () => {
    queryMock.mockReturnValueOnce({
      promise: () => Promise.reject(new Error("Test error")),
    });

    const event = {
      queryStringParameters: { userId: "user-123" },
    } as unknown as APIGatewayProxyEvent;

    const result = (await handler(
      event,
      dummyContext,
      undefined
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toEqual(500);
    expect(JSON.parse(result.body).message).toEqual("Internal server error");
  });

  it("returns 400 if userId is missing", async () => {
    const result = (await handler(
      {} as APIGatewayProxyEvent,
      dummyContext,
      undefined
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toEqual(400);
    expect(JSON.parse(result.body)).toEqual({ error: "Missing userId" });
  });
});
