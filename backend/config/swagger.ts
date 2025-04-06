// Swagger setup
export const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Roomie Match API",
        version: "1.0.0",
        description: "API documentation for Roomie Match – Fullstack Project",
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ["./backend/routes/*.ts"], 
  };