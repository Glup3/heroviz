import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { useMemo } from "react";

const startingDate = "2024-01-01";

export const meta: MetaFunction = () => {
  return [
    { title: "HeroViz" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  return json({ data: ["2024-08-04"] });
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();

  const start = dayjs(startingDate);
  const end = start.add(80, "years");

  const totalDays = end.diff(start, "days");

  const datesGroupedByYear = useMemo(() => {
    return Array.from({ length: totalDays }, (_, i) =>
      start.add(i, "days")
    ).reduce<Record<number, dayjs.Dayjs[]>>((acc, date) => {
      const year = date.year();
      if (!acc[year]) {
        acc[year] = [];
      }

      acc[year].push(date);
      return acc;
    }, {});
  }, [totalDays, start]);

  return (
    <div className="font-sans p-4">
      {data}
      <div className="max-w-3xl">
        {Object.entries(datesGroupedByYear).map(([year, dates]) => (
          <div key={`year-${year}`} className="mb-4">
            <div className="flex flex-wrap gap-2">
              {dates.map((date) => (
                <div
                  key={date.format("YYYY-MM-DD")}
                  className={`size-4 bg-sky-400`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
