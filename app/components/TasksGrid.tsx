import { Dayjs } from "dayjs";

export const TasksGrid = (props: {
  hexcolor: string;
  dates: Dayjs[];
  accomplishedDates: Set<string>;
  year?: string;
}) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {props.dates.map((date) => {
        const key = date.format("YYYY-MM-DD");

        return (
          <div
            key={key}
            className={`size-4 group relative flex`}
            style={{
              backgroundColor: props.accomplishedDates.has(key)
                ? props.hexcolor
                : "#ddd",
            }}
          >
            <div className="-top-8 -left-8 absolute bg-white scale-0 transition-all rounded p-1 text-xs group-hover:scale-100 z-10 text-nowrap border shadow-md">
              {date.format("DD MMM YYYY")}
            </div>
          </div>
        );
      })}

      <span className="text-xs font-semibold">{props.year}</span>
    </div>
  );
};
