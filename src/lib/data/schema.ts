import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const achievements = pgTable(
  "achievement",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    user: uuid("user")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
  },
  (t) => ({
    uniq: unique().on(t.user, t.key),
  }),
);

export const staticData = pgTable("static_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  sheet: text("sheet").notNull().unique(),
  data: jsonb("data").notNull(),
});

export const mails = pgTable(
  "mail",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    sender: text("sender").notNull(),
    recipient: uuid("recipient")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    body: text("body").notNull(),
    rewards: text("rewards").notNull(),
    isReceived: boolean("isReceived").notNull().default(false),
  },
  (t) => ({
    recipientIndex: index("recipientIndex").on(t.recipient),
  }),
);

export const items = pgTable(
  "item",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    owner: uuid("owner")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    category: text("category").notNull(),
    quantity: integer("quantity").notNull().default(0),
  },
  (t) => ({
    uniq: unique().on(t.owner, t.category, t.key),
  }),
);

export const resources = pgTable(
  "resource",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    owner: uuid("owner")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    value: integer("value").notNull().default(0),
  },
  (t) => ({
    uniq: unique().on(t.owner, t.key),
  }),
);

export const users = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  userId: text("userId").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull().unique(),
  isAdmin: boolean("isAdmin").notNull().default(false),
  isBanned: boolean("isBanned").notNull().default(false),
  chips: integer("chips").notNull().default(0),
  tokens: integer("tokens").notNull().default(0),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: uuid("identity")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
});
