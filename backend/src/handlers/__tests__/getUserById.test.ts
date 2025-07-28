import { handler } from "../getUserById";
import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

const getMock = jest.fn();

DynamoDB.DocumentClient.prototype.get = getMock;

const dummyContext = {} as Context;

describe("getUserById", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns user by ID", async () => {
    getMock.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValue({
        Item: { id: "1", name: "Jordan", email: "jordan@example.com" },
      }),
    });

    const event = {
      pathParameters: { id: "abc" },
    } as unknown as APIGatewayProxyEvent;

    const res = (await handler(
      event,
      dummyContext,
      undefined
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).name).toBe("Jordan");
  });

  it("returns 404 if user not found", async () => {
    getMock.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValue({}),
    });

    const event = {
      pathParameters: { id: "123" },
    } as unknown as APIGatewayProxyEvent;

    const res = (await handler(
      event,
      dummyContext,
      undefined
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toBe(404);
    expect(JSON.parse(res.body)).toEqual({ error: "User not found" });
  });

  it("returns 400 if no ID is provided", async () => {
    const event = {
      pathParameters: {},
    } as unknown as APIGatewayProxyEvent;

    const res = (await handler(
      event,
      dummyContext,
      undefined
    )) as APIGatewayProxyResult;
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body)).toEqual({ error: "User ID is required" });
  });

  it("returns 500 on error", async () => {
    getMock.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValue(new Error("Dynamo error")),
    });

    const event = {
      pathParameters: { id: "1" },
    } as unknown as APIGatewayProxyEvent;

    const res = (await handler(
      event,
      dummyContext,
      undefined
    )) as APIGatewayProxyResult;
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body)).toEqual({ error: "Could not fetch user" });
  });
});
