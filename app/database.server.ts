import { relations, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import {
  text,
  integer,
  sqliteTable,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import Database from "better-sqlite3";

const sqlite = new Database(process.env.DATABASE_URL);

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().notNull(),
  description: text("description").notNull(),
  hexcolor: text("hexcolor").notNull().default("#38bdf8"),
});

export const accomplisheds = sqliteTable(
  "accomplisheds",
  {
    taskId: integer("task_id")
      .notNull()
      .references(() => tasks.id),
    date: text("date").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.taskId, table.date] }),
    };
  }
);

export const tasksRelations = relations(tasks, ({ many }) => ({
  accomplisheds: many(accomplisheds),
}));

export const accomplishedsRelations = relations(accomplisheds, ({ one }) => ({
  task: one(tasks, {
    fields: [accomplisheds.taskId],
    references: [tasks.id],
  }),
}));

export const db = drizzle(sqlite, {
  schema: { tasks, accomplisheds, tasksRelations, accomplishedsRelations },
});

export const setupDatabase = () => {
  db.run(sql`
    create table if not exists tasks (
      id integer primary key,
      name text not null,
      description text not null,
      hexcolor text not null default '#38bdf8'
    )
  `);

  db.run(sql`
    create table if not exists accomplisheds (
      task_id integer not null,
      date text not null,
      primary key (task_id, date),
      foreign key (task_id) references tasks(id)
    )
  `);
};
