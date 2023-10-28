import dotenv from "dotenv";
import { join } from "path";
import { seeders } from "./seeders";
const prompt = require("select-prompt");

dotenv.config({
  path: join(__dirname, "../.env"),
});

async function runSeeder(seeder?: typeof seeders[0]) {
  if (!seeder) {
    return;
  }

  console.log(`Running ${seeder.name}`)
  const res = await seeder.run();
  console.log(`${res.length} rows created`);
}

function runSeeders() {
  prompt(
    "Please select the seeds you want to run:",
    [{ title: "All", value: "all" }].concat(
      seeders.map(({ name, run }) => ({ title: name, value: name }))
    )
  ).on("submit", async (data: string) => {
    if (data === 'all') {
      for (let i = 0; i < seeders.length; i++) {
        await runSeeder(seeders[i]);
      }
    } else {
      await runSeeder(seeders.find(({ name }) => name === data))
    }
    process.exit(1);
  });
}

if (process.env.NODE_ENV !== "development") {
  prompt(
    "Running seeders might create ambigious or corrupt current data. Are you sure you want to continue",
    [
      { title: "Yes", value: "yes" },
      { title: "No", value: "no" },
    ]
  ).on("submit", (answer = "no") => {
    if (answer === "no") {
      process.exit(1);
    } else {
      runSeeders();
    }
  });
} else {
  runSeeders();
}


