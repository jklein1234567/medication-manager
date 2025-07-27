import { handler } from "../updateTakeLog"; // renamed handler
import { DynamoDBClient, UpdateItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

jest.mock("@aws-sdk/client-dynamodb");

const dummyContext = {} as Context;

describe("updateTakeLog", () => {
  const mockSend = jest.fn();
  const clientMock = DynamoDBClient as jest.MockedClass<typeof DynamoDBClient>;

  beforeEach(() => {
    clientMock.prototype.send = mockSend;
    jest.clearAllMocks();
  });

  it("returns 400 if ID is missing", async () => {
    const dummyEvent = {
      pathParameters: {},
    } as unknown as APIGatewayProxyEvent;

    const result = (await handler(
      dummyEvent,
      dummyContext,
      undefined
    )) as APIGatewayProxyResult;
    expect(result.statusCode).toEqual(400);
    expect(result.body).toContain("Missing ID");
  });

  it("adds today's date to takenLog if not already present", async () => {
    // Mock getItem returning no takenLog
    mockSend.mockImplementationOnce(() =>
      Promise.resolve({
        Item: {
          id: { S: "123" },
          takenLog: { L: [] },
        },
      })
    );

    // Mock update command
    mockSend.mockImplementationOnce(() => Promise.resolve({}));

    const event = {
      pathParameters: { id: "123" },
    } as unknown as APIGatewayProxyEvent;

    const result = (await handler(event, dummyContext, undefined)) as APIGatewayProxyResult;

    expect(mockSend).toHaveBeenCalledTimes(2);
    expect(mockSend.mock.calls[1][0]).toBeInstanceOf(UpdateItemCommand);
    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body).message).toEqual("Marked as taken");
  });

  it("removes today's date from takenLog if already present", async () => {
    const today = "2025-07-27";

    // Mock getItem returning today's date in takenLog
    mockSend.mockImplementationOnce(() =>
      Promise.resolve({
        Item: {
          id: { S: "123" },
          takenLog: {
            L: [{ S: today }],
          },
        },
      })
    );

    // Mock update command
    mockSend.mockImplementationOnce(() => Promise.resolve({}));

    const event = {
      pathParameters: { id: "123" },
    } as unknown as APIGatewayProxyEvent;

    const result = (await handler(event, dummyContext, undefined)) as APIGatewayProxyResult;

    expect(mockSend).toHaveBeenCalledTimes(2);
    expect(mockSend.mock.calls[1][0]).toBeInstanceOf(UpdateItemCommand);
    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body).message).toEqual("Marked as not taken");
  });

  it("returns 500 on DynamoDB failure", async () => {
    mockSend.mockRejectedValue(new Error("DB error"));

    const event = {
      pathParameters: { id: "123" },
    } as unknown as APIGatewayProxyEvent;

    const result = (await handler(
      event,
      dummyContext,
      undefined
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toEqual(500);
    expect(JSON.parse(result.body).message).toEqual("Failed to update takenLog");
  });
});
