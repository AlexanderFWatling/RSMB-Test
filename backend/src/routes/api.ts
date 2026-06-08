import { Router } from "express";
import {
  getSummaryMetrics,
  getCampaigns,
  getPlatforms,
  getTrends,
} from "../controllers/metrics";

const router = Router();

router.get("/metrics/summary", getSummaryMetrics);
router.get("/metrics/trends", getTrends);
router.get("/platforms", getPlatforms);
router.get("/campaigns", getCampaigns);

export default router;
