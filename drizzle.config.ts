import { env } from "~/env";
import { defineConfig } from "drizzle-kit";

const drizzleConfig = defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/server/db/schema/**/*.ts",

  dbCredentials: {
    url: env.DATABASE_URL,
  },

  /*
  extensionsFilters: ["postgis"],
*/
  schemaFilter: "public",
  tablesFilter: "*",

  introspect: {
    casing: "camel",
  },

  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },
});

export default drizzleConfig;
