import { APIGatewayProxyResult, Context } from "aws-lambda";
import { handler } from "../createUser";
import { DynamoDB } from "aws-sdk";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "test-uuid"),
}));

const putMock = jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue({}) });
DynamoDB.DocumentClient.prototype.put = putMock;

const dummyContext = {} as Context;

describe("createUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("creates a user successfully", async () => {
    const event = {
      body: JSON.stringify({ name: "Jane Doe", email: "jane@example.com" }),
    } as any;

    const res = await handler(event, dummyContext, undefined) as APIGatewayProxyResult;

    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res.body)).toEqual({
      id: "test-uuid",
      name: "Jane Doe",
      email: "jane@example.com",
      image: null,
    });
  });

  it("handles error during creation", async () => {
    putMock.mockReturnValueOnce({ promise: jest.fn().mockRejectedValue(new Error("fail")) });

    const event = {
      body: JSON.stringify({ name: "Jane Doe", email: "jane@example.com" }),
    } as any;

    const res = await handler(event, dummyContext, undefined) as APIGatewayProxyResult;
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body)).toEqual({ error: "Could not create user" });
  });
});
