import { ExtractJwt, Strategy } from "passport-jwt";
import { getUser } from "../../users/users.service";
import dotenv from "dotenv";

dotenv.config();

export const jwtStrategy = new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string,
  },
  async (payload, done) => {
    try {
      const user = await getUser("email", payload.email, true, false);

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err, false);
    }
  }
);
