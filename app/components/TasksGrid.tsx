import { Dayjs } from "dayjs";

export const TasksGrid = (props: {
  hexcolor: string;
  dates: Dayjs[];
  accomplishedDates: Set<string>;
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {props.dates.map((date) => {
        const key = date.format("YYYY-MM-DD");

        return (
          <div
            key={key}
            className={`size-4`}
            style={{
              backgroundColor: props.accomplishedDates.has(key)
                ? props.hexcolor
                : "#ddd",
            }}
          />
        );
      })}
    </div>
  );
};
