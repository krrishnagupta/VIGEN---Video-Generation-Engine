// Explicitly force dynamic executing context without standard Turbopack caches
export const dynamic = "force-dynamic";

import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { helloWorld, generateVideo, generateFinalVideo, scheduleDailyVideoGeneration } from "@/lib/inngest/functions";

// Create an API that serves zero-downtime background functions mapping our exports universally
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    generateVideo,
    generateFinalVideo,
    scheduleDailyVideoGeneration
  ]
});
