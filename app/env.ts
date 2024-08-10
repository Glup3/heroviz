import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  HEROVIZ_USERNAME: z.string(),
  HEROVIZ_PASSWORD: z.string(),
});

const env = envSchema.parse(process.env);

export default env;
