import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { TasksGrid } from "~/components/TasksGrid";
import { db } from "~/database.server";

const getAllTasks = async () => {
  return db.query.tasks.findMany({
    with: {
      accomplisheds: {
        columns: {
          date: true,
        },
      },
    },
  });
};

export const meta: MetaFunction = () => {
  return [
    { title: "HeroViz" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  const allTasks = await getAllTasks();
  const start = dayjs().month(0).date(1);
  const end = start.add(1, "year");

  const dates = Array.from({ length: end.diff(start, "day") }, (_, i) =>
    start.add(i, "day").format("YYYY-MM-DD")
  );

  return json({ allTasks, dates });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="p-4">
      <h1 className="font-semibold text-3xl mb-4">Dashboard</h1>

      <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
        {data.allTasks.map((task) => {
          return (
            <div
              key={`task-${task.id}`}
              className="border p-4 shadow"
              // style={{ borderColor: task.hexcolor }}
            >
              <h2 className="font-semibold">{task.name}</h2>
              <p className="text-slate-500 text-sm mb-4">{task.description}</p>

              <TasksGrid
                dates={data.dates.map(dayjs)}
                hexcolor={task.hexcolor}
                accomplishedDates={
                  new Set(task.accomplisheds.map((a) => a.date))
                }
              />
            </div>
          );
        })}
      </div>
    </main>
  );
}
