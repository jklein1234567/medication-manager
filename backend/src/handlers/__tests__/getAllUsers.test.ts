import { handler } from "../getAllUsers";
import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  Context,
} from "aws-lambda";

const scanMock = jest.fn();

DynamoDB.DocumentClient.prototype.scan = scanMock;

const dummyEvent = {} as APIGatewayProxyEvent;
const dummyContext = {} as Context;

describe("getAllUsers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns all users", async () => {
    scanMock.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValue({
        Items: [
          { id: "1", name: "A", email: "a@example.com" },
          { id: "2", name: "B", email: "b@example.com" },
        ],
      }),
    });

    const res = (await handler(
      dummyEvent,
      dummyContext,
      undefined
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toHaveLength(2);
  });

  it("returns 500 on error", async () => {
    scanMock.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValue(new Error("failure")),
    });

    const res = (await handler(
      dummyEvent,
      dummyContext,
      undefined
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body)).toEqual({ error: "Could not fetch users" });
  });
});
