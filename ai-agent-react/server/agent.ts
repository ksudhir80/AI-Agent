import OpenAI from "openai";
import { executeTool } from "./agentTools";

export async function runAgent(
  openai: OpenAI,
  message: string
) {
const tools = [
  {
    type: "function" as const,
    name: "searchCustomer",
    description:
      "Search for a customer by name.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            "The customer's name to search for.",
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },

  {
    type: "function" as const,
    name: "getCustomerPolicy",
    description:
      "Get insurance policy details for a customer using the customer ID.",
    parameters: {
      type: "object",
      properties: {
        customerId: {
          type: "number",
          description:
            "The unique ID of the customer.",
        },
      },
      required: ["customerId"],
      additionalProperties: false,
    },
  },

  {
    type: "function" as const,
    name: "readExcelFile",
    description:
      "Read data from an Excel workbook and return all sheets and rows.",
    parameters: {
      type: "object",
      properties: {
        fileName: {
          type: "string",
          description:
            "The Excel file name located in the server data folder.",
        },
      },
      required: ["fileName"],
      additionalProperties: false,
    },
  },

  {
    type: "function" as const,
    name: "listFiles",
    description:
      "List all supported files available in the server data folder. Use this when the user asks about a file but does not specify its file name.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false,
    },
  },

  {
    type: "function" as const,
    name: "readPdfFile",
    description:
      "Read and extract text from a PDF file in the server data folder. Use this when the user asks a question about information contained in a PDF.",
    parameters: {
      type: "object",
      properties: {
        fileName: {
          type: "string",
          description:
            "The PDF file name located in the server data folder.",
        },
        password: {
          type: "string",
          description:
            "Optional password required to open the PDF.",
        },
      },
      required: ["fileName"],
      additionalProperties: false,
    },
  },

  {
  type: "function" as const,
  name: "readDocumentFile",
  description:
    "Read and extract text from a Word document (.doc or .docx) in the server data folder. Use this when the user asks a question about information contained in a Word document.",
  parameters: {
    type: "object",
    properties: {
      fileName: {
        type: "string",
        description:
          "The Word document file name located in the server data folder.",
      },
    },
    required: ["fileName"],
    additionalProperties: false,
  },
},
];

  let response = await openai.responses.create({
    model: "gpt-5.6",
    input: message,
    tools,
  });

  while (true) {
    const functionCalls =
      response.output.filter(
        (item) =>
          item.type === "function_call"
      );

    // No more tools required
    if (functionCalls.length === 0) {
      return response.output_text;
    }

    const toolOutputs = [];

    for (const item of functionCalls) {
      console.log(
        "Agent requested tool:",
        item.name
      );

      console.log(
        "Arguments:",
        item.arguments
      );

   const result = await executeTool(
  item.name,
  item.arguments
);
      console.log(
        "Tool result:",
        result
      );

      toolOutputs.push({
        type: "function_call_output" as const,
        call_id: item.call_id,
        output: JSON.stringify(result),
      });
    }

    response = await openai.responses.create({
      model: "gpt-5.6",

      previous_response_id:
        response.id,

      input: toolOutputs,

      tools,
    });
  }
}