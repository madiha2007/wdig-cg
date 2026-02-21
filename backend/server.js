import express from "express";
import cors from "cors";
import institutesRouter from "./routes/institutes.js";
import questionsRouter from "./routes/questions.js";
import predictRouter from "./routes/predict.js";

const app = express();
app.use(cors()); // allow requests from Next.js
app.use(express.json()); 

// ← ADD THIS
app.use((req, res, next) => {
  console.log(`→ ${req.method} ${req.path}`);
  next();
});


app.use("/institutes", institutesRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/predict", predictRouter);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
