import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useRouteError } from "@remix-run/react";
import dayjs from "dayjs";
import { useMemo } from "react";
import { z } from "zod";
import { TasksGrid } from "~/components/TasksGrid";
import { db } from "~/database.server";

const getTask = async (id: number) => {
  return db.query.tasks.findFirst({
    where: (tasks, { eq }) => eq(tasks.id, id),
    with: {
      accomplisheds: {
        columns: {
          date: true,
        },
      },
    },
  });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const id = z.coerce.number().parse(params.id);
  const task = await getTask(id);

  if (task === undefined) {
    throw new Error("Task not found");
  }

  return json({ task });
};

export default function TasksDetailPage() {
  const { task } = useLoaderData<typeof loader>();

  return (
    <main className="p-4">
      <h1 className="text-2xl font-semibold">{task.name}</h1>
      <p className="mb-4 text-slate-500">{task.description}</p>
      <BoxGrid key={task.id} task={task} />
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  console.log(error);

  return <div>Unexpected error</div>;
}

type Task = NonNullable<Awaited<ReturnType<typeof getTask>>>;

const BoxGrid = (props: { task: Task }) => {
  const start = dayjs("2024-01-01");
  const end = start.add(5, "years");

  const datesGroupedByYear = useMemo(() => {
    return Array.from({ length: end.diff(start, "days") }, (_, i) =>
      start.add(i, "days")
    ).reduce<Record<number, dayjs.Dayjs[]>>((acc, date) => {
      const year = date.year();
      if (!acc[year]) {
        acc[year] = [];
      }

      acc[year].push(date);
      return acc;
    }, {});
  }, [start, end]);

  const accomplishedDates = new Set(
    props.task.accomplisheds.map((a) => a.date)
  );

  return (
    <div className="max-w-3xl">
      {Object.entries(datesGroupedByYear).map(([year, dates]) => (
        <div key={`year-${year}`} className="mb-4">
          <TasksGrid
            dates={dates}
            hexcolor={props.task.hexcolor}
            accomplishedDates={accomplishedDates}
            year={year}
          />
        </div>
      ))}
    </div>
  );
};
