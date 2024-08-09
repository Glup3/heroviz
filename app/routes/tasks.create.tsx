import { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { z } from "zod";
import { db, tasks } from "~/database.server";

const formSchema = z.object({
  taskName: z.string(),
  description: z.string(),
  hexcolor: z.string(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = formSchema.parse(Object.fromEntries(formData));

  await db.insert(tasks).values({
    name: data.taskName,
    description: data.description,
    hexcolor: data.hexcolor,
  });

  return redirect("/");
};

export default function TasksCreatePage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Create New Task</h1>

      <div className="max-w-lg mx-auto p-4 border shadow bg-white">
        <Form method="post" className="space-y-4" id="create-task-form">
          <div className="flex flex-col">
            <label
              htmlFor="taskName"
              className="text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="taskName"
              name="taskName"
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="hexcolor"
              className="text-sm font-medium text-gray-700"
            >
              Color
            </label>
            <input
              type="color"
              id="hexcolor"
              name="hexcolor"
              className="w-full mt-1 border border-gray-300 rounded-md p-1"
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Submit
          </button>
        </Form>
      </div>
    </main>
  );
}
