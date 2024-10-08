import { ActionFunctionArgs, json } from "@remix-run/node";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { isAuthorized } from "~/auth";
import { accomplisheds, db, tasks } from "~/database.server";

const bodySchema = z.object({
  taskId: z.number(),
  date: z.string().date(),
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

  const entries = await db.query.accomplisheds.findMany({
    where: (accomplisheds, { eq, and }) =>
      and(
        eq(accomplisheds.taskId, body.taskId),
        eq(accomplisheds.date, body.date)
      ),
  });

  if (entries.length > 0) {
    await db
      .delete(accomplisheds)
      .where(
        and(
          eq(accomplisheds.taskId, body.taskId),
          eq(accomplisheds.date, body.date)
        )
      );
  } else {
    await db.insert(accomplisheds).values({
      taskId: body.taskId,
      date: body.date,
    });
  }

  return json({ message: "OK" }, 200);
};
