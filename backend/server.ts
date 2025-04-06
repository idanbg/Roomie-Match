import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/upload", uploadRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Roomie Match API is live!");
});

console.log("🔍 MONGO_URI:", process.env.MONGO_URI);

connectDB()
  .then(() => {
    app.listen(Number(PORT), () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
// Swagger setup
const options = {
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

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
