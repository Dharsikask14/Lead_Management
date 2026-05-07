export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Lead Management Portal API",
    version: "1.0.0",
    description: "REST API for authenticated multi-user lead management with user-level data isolation."
  },
  servers: [{ url: "http://localhost:5000/api" }],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "access_token"
      },
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      RegisterInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Anika Sharma" },
          email: { type: "string", format: "email", example: "anika@example.com" },
          password: { type: "string", minLength: 8, example: "SecurePass123" }
        }
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "anika@example.com" },
          password: { type: "string", example: "SecurePass123" }
        }
      },
      LeadInput: {
        type: "object",
        required: ["leadName", "companyName", "email", "phoneNumber", "serviceInterested", "status"],
        properties: {
          leadName: { type: "string", example: "Rahul Mehta" },
          companyName: { type: "string", example: "Northstar Labs" },
          email: { type: "string", format: "email", example: "rahul@northstar.example" },
          phoneNumber: { type: "string", example: "+91 98765 43210" },
          serviceInterested: { type: "string", example: "CRM Implementation" },
          status: {
            type: "string",
            enum: ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"],
            example: "Qualified"
          },
          notes: { type: "string", example: "Requested a product walkthrough next week." }
        }
      },
      Lead: {
        allOf: [
          { $ref: "#/components/schemas/LeadInput" },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" }
            }
          }
        ]
      }
    }
  },
  paths: {
    "/auth/register": {
      post: {
        summary: "Register",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterInput" } } }
        },
        responses: { 201: { description: "Registered" }, 409: { description: "Email already exists" } }
      }
    },
    "/auth/login": {
      post: {
        summary: "Login",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginInput" } } }
        },
        responses: { 200: { description: "Logged in" }, 401: { description: "Invalid credentials" } }
      }
    },
    "/auth/me": {
      get: {
        summary: "Current authenticated user",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: { 200: { description: "Current user" }, 401: { description: "Unauthorized" } }
      }
    },
    "/auth/logout": {
      post: {
        summary: "Logout",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: { 204: { description: "Logged out" } }
      }
    },
    "/leads": {
      get: {
        summary: "List owned leads",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: "q", in: "query", schema: { type: "string" } },
          {
            name: "status",
            in: "query",
            schema: { type: "string", enum: ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"] }
          },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } }
        ],
        responses: { 200: { description: "Paginated owned lead list" } }
      },
      post: {
        summary: "Create an owned lead",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LeadInput" } } }
        },
        responses: { 201: { description: "Lead created" }, 400: { description: "Validation error" } }
      }
    },
    "/leads/{id}": {
      get: {
        summary: "Get an owned lead by id",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Lead" }, 404: { description: "Not found" } }
      },
      patch: {
        summary: "Update an owned lead by id",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LeadInput" } } }
        },
        responses: { 200: { description: "Lead updated" }, 404: { description: "Not found" } }
      },
      delete: {
        summary: "Delete an owned lead by id",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 204: { description: "Lead deleted" }, 404: { description: "Not found" } }
      }
    }
  }
};
