import { handler } from "../toggleActivity";
import { UpdateItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type {
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

jest.mock("@aws-sdk/client-dynamodb");

const dummyContext = {} as Context;

describe("toggleActivity handler", () => {
  const mockSend = jest.fn();
  const clientMock = DynamoDBClient as jest.MockedClass<typeof DynamoDBClient>;

  beforeEach(() => {
    clientMock.prototype.send = mockSend;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if ID is missing", async () => {
    const event = {
      pathParameters: {},
    } as unknown as APIGatewayProxyEvent;

    const result = (await handler(
      event,
      dummyContext,
      undefined
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toEqual(400);
    expect(result.body).toContain("Missing ID");
  });

  it("toggles isActive successfully", async () => {
    mockSend.mockResolvedValueOnce({
      Item: {
        id: { S: "abc" },
        isActive: { BOOL: true },
      },
    }); // First call: GetItemCommand
  
    mockSend.mockResolvedValueOnce({}); // Second call: UpdateItemCommand
  
    const event = {
      pathParameters: { id: "abc" },
    } as unknown as APIGatewayProxyEvent;
  
    const result = (await handler(event, dummyContext, undefined)) as APIGatewayProxyResult;
  
    // Check 2nd call (UpdateItemCommand)
    const updateCallArg = mockSend.mock.calls[1][0];
    expect(updateCallArg).toBeInstanceOf(UpdateItemCommand);
  
    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body).message).toEqual("Toggled isActive");
  });
  

  it("returns 500 on DynamoDB failure", async () => {
    mockSend.mockRejectedValue(new Error("Toggle error"));

    const event = {
      pathParameters: { id: "abc" },
    } as unknown as APIGatewayProxyEvent;

    const result = (await handler(
      event,
      dummyContext,
      undefined
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toEqual(500);
    expect(JSON.parse(result.body).message).toEqual("Failed to toggle isActive");
  });
});
