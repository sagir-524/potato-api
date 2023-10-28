import * as usersSeeder from "./users.seeder";
import * as permissionsSeeder from "./permissions.seeder";

export const seeders = [
  {
    name: permissionsSeeder.name,
    run: permissionsSeeder.run,
  },
  {
    name: usersSeeder.name,
    run: usersSeeder.run
  }
];