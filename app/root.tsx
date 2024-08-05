import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import "./tailwind.css";
import { Sidebar } from "./components/Sidebar";
import { db } from "./database.server";

export const loader = async () => {
  const allTasks = await db.query.tasks.findMany({});
  return json({ allTasks });
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex">
      <Sidebar
        tasks={data.allTasks.map((t) => ({
          id: t.id,
          name: t.name,
          hexcolor: t.hexcolor,
        }))}
      />
      <Outlet />
    </div>
  );
}
