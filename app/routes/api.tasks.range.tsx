import { ActionFunctionArgs, json } from "@remix-run/node";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { isAuthorized } from "~/auth";
import { accomplisheds, db, tasks } from "~/database.server";

const TIMEZONE = "Europe/Berlin";
dayjs.extend(utc);
dayjs.extend(timezone);

const bodySchema = z.object({
  taskId: z.number(),
  fromDate: z.string().date(),
  toDate: z.string().date(),
});

export const headers = () => ({
  "WWW-Authenticate": "Basic",
});

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  if (!isAuthorized(request)) {
    return json({ message: "Unauthorized" }, 401);
  }

  const body = bodySchema.parse(await request.json());

  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, body.taskId),
  });
  if (!task) {
    return json({ message: "Task not found" }, 404);
  }

  const from = dayjs(body.fromDate).tz(TIMEZONE);
  const to = dayjs(body.toDate).tz(TIMEZONE);
  if (from.isAfter(to)) {
    return json({ message: "Invalid from - to date range" }, 400);
  }

  const dates = Array.from({ length: to.diff(from, "days") + 1 }).map(
    (_, i) => ({
      taskId: body.taskId,
      date: from.add(i, "days").format("YYYY-MM-DD"),
    })
  );

  await db.insert(accomplisheds).values(dates).onConflictDoNothing();

  return json({ message: "OK" }, 200);
};
