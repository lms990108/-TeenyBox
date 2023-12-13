import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Teeny Box",
      version: "1.0.0",
      description:
        "This is a server including information and community for shows and reviews",
      contact: {
        name: "Team Teeny Box",
        url: "https://dailytopia2.shop/",
        email: "easygoinglife2@gmail.com",
      },
    },
    servers: [
      {
        url: "https://dailytopia2.shop/api",
        description: "development server",
      },
      {
        url: "http://localhost:5001/api",
        description: "local server",
      },
    ],
  },
  apis: ["./src/routers/*.ts"],
};

const swaggerDocument = swaggerJSDoc(options);

export default swaggerDocument;
