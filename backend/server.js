import express from "express";
import cors from "cors";
import "dotenv/config";
import institutesRouter from "./routes/institutes.js";
import questionsRouter from "./routes/questions.js";
import predictRouter from "./routes/predict.js";
import userRouter     from "./routes/user.js";
import feedbackRouter from "./routes/feedback.js";
import historyRouter  from "./routes/history.js";
import reportRouter from "./routes/report.js";

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
app.use("/api/user",     userRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/history",  historyRouter);
app.use("/api/report", reportRouter);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
