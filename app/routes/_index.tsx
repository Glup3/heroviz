import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { useMemo } from "react";
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
  return json({ allTasks });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="font-sans p-4">
      <div className="flex gap-8">
        {data.allTasks.map((task) => {
          return <BoxGrid key={task.id} task={task} />;
        })}
      </div>
    </div>
  );
}

type Task = Awaited<ReturnType<typeof getAllTasks>>[number];

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

  const accomplishedDates = new Map<string, boolean>(
    props.task.accomplisheds.map((a) => [a.date, true])
  );

  return (
    <div className="max-w-3xl">
      {Object.entries(datesGroupedByYear).map(([year, dates]) => (
        <div key={`year-${year}`} className="mb-4">
          <div className="flex flex-wrap gap-2">
            {dates.map((date) => {
              const key = date.format("YYYY-MM-DD");
              return (
                <div
                  key={key}
                  className={`size-4`}
                  style={{
                    backgroundColor: accomplishedDates.has(key)
                      ? props.task.hexcolor
                      : "#ddd",
                  }}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
