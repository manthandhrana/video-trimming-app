import swaggerJSDoc from 'swagger-jsdoc'; // ES Module import

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Video Upload & Trimming API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"],
};

export default swaggerJSDoc(options); // Use export default instead of module.exports
