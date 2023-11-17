import dotenv from "dotenv";
import { join } from "path";
import { seeders } from "./seeders";
import confirm from "@inquirer/confirm";
import { select } from "@inquirer/prompts";

dotenv.config({
  path: join(__dirname, "../.env"),
});

async function runSeeder(seeder?: (typeof seeders)[0]) {
  if (!seeder) {
    return;
  }

  console.log(`Running ${seeder.name}`);
  const res = await seeder.run();
  console.log(`${res.length} rows created`);
}

async function runSeeders() {
  const res = await select({
    message: "Please select the seeds you want to run:",
    choices: [
      { name: 'All', value: 'all' },
      ...seeders.map(({ name }) => {
        return { name, value: name }
      })
    ]
  });

  if (res === "all") {
    for (let i = 0; i < seeders.length; i++) {
      await runSeeder(seeders[i]);
    }
  } else {
    await runSeeder(seeders.find(({ name }) => name === res));
  }
  process.exit(1);
}

if (process.env.NODE_ENV !== "development") {
  confirm({
    message: "Running seeders might create ambigious or corrupt current data. Are you sure you want to continue"
  }).then((res) => {
    if (res) {
      runSeeders();
    } else {
      process.exit(1);
    }
  });
} else {
  runSeeders();
}
