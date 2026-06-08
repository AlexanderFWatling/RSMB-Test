import express from "express";
import cors from "cors";
import path from "path";
import apiRoutes from "./routes/api";
import { loadData } from "./services/loader";
import { setData, getAllData } from "./services/store";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const CSV_PATH = path.join(
  process.cwd(),
  "data/global_ads_performance_dataset.csv",
);

const startServer = async () => {
  try {
    const data = await loadData(CSV_PATH);
    setData(data);
    console.log(`Successfully loaded ${data.length} rows into memory.`);

    app.get("/api/health", (req, res) => {
      res.json({ status: "ok", recordsLoaded: getAllData().length });
    });

    app.use("/api", apiRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to load data and start server:", error);
    process.exit(1);
  }
};

startServer();
