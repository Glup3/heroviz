import { Link } from "@remix-run/react";

export const Sidebar = (props: {
  tasks: { id: number; name: string; hexcolor: string }[];
}) => {
  return (
    <div className="min-w-72 bg-slate-100 border-slate-300 border-r border-b p-4">
      <nav>
        <p className="font-semibold text-xl mb-4">
          <Link to="/">HeroViz</Link>
        </p>

        <ul className="space-y-2">
          {props.tasks.map((task) => (
            <li key={`task-${task.id}`}>
              <Link
                to={`tasks/${task.id}`}
                className="flex items-center gap-2 hover:underline"
              >
                <div
                  className="size-2 rounded-full"
                  style={{ backgroundColor: task.hexcolor }}
                />
                {task.name}
              </Link>
            </li>
          ))}

          <li>
            <Link to="tasks/create" className="pl-4 hover:underline">
              Create New Task
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
