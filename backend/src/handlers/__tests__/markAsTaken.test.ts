import { handler } from "../markAsTaken";
import { UpdateItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

jest.mock("@aws-sdk/client-dynamodb");

const dummyContext = {} as Context;

describe("markAsTaken", () => {
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

  it("updates medication takenLog", async () => {
    mockSend.mockResolvedValue({});

    const event = {
      pathParameters: { id: "123" },
    } as unknown as APIGatewayProxyEvent;

    const result = (await handler(
      event,
      dummyContext,
      undefined
    )) as APIGatewayProxyResult;

    expect(mockSend).toHaveBeenCalledWith(expect.any(UpdateItemCommand));
    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body).message).toEqual("Successfully marked as taken");
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
