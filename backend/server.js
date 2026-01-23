import express from "express";
import cors from "cors";
import institutesRouter from "./routes/institutes.js";
import questionsRouter from "./routes/questions.js";

const app = express();
app.use(cors()); // allow requests from Next.js

app.use("/institutes", institutesRouter);
app.use("/api/questions", questionsRouter);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
