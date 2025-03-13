import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API MERN STACK",
      version: "1.0.0",
      description: "Una API para MERN STACK",
    },
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
    servers: [
      {
        url: `http://localhost:5174`,
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const specs = swaggerJSDoc(options);
