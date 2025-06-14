import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return NextResponse.json({
    openapi: "3.0.0",
    info: {
      title: "Book API",
      description: "A simple API to manage books",
      version: "3.0.0",
    },
    paths: {
      "/books": {
        get: {
          summary: "Get a list of all books",
          operationId: "getBooks",
          responses: {
            "200": {
              description: "A list of books",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        title: { type: "string" },
                        author: { type: "string" },
                        publishedDate: { type: "string" },
                        genre: { type: "string" },
                        publisher: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Add a new book",
          operationId: "addBook",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    author: { type: "string" },
                    publishedDate: { type: "string" },
                    genre: { type: "string" },
                    publisher: { type: "string" },
                  },
                  required: ["title", "author", "publishedDate"],
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Book created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      title: { type: "string" },
                      author: { type: "string" },
                      publishedDate: { type: "string" },
                      genre: { type: "string" },
                      publisher: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/books/{bookId}": {
        get: {
          summary: "Get details of a single book",
          operationId: "getBookById",
          parameters: [
            {
              in: "path",
              name: "bookId",
              required: true,
              schema: {
                type: "integer",
              },
            },
          ],
          responses: {
            "200": {
              description: "Details of a book",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      title: { type: "string" },
                      author: { type: "string" },
                      publishedDate: { type: "string" },
                      genre: { type: "string" },
                      publisher: { type: "string" },
                      reviews: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            reviewer: { type: "string" },
                            rating: { type: "integer" },
                            comment: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "404": {
              description: "Book not found",
            },
          },
        },
      },
    },
  });
}
