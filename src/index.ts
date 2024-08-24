import "dotenv/config";
import { init } from "@sentry/node";
import { Member, type Role, User } from "oceanic.js";
import { Discord } from "#client";
import { version } from "#package";

export const client = new Discord();

init({
  dsn: process.env.SENTRY_DSN_URL,
  _experiments: {
    metricsAggregator: true,
  },
  release: version,
  tracesSampleRate: 0.5,
});

Object.defineProperty(User.prototype, "name", {
  get: function () {
    return this.globalName ?? this.username;
  },
});

Object.defineProperty(Member.prototype, "highestRole", {
  get: function () {
    const everyoneRole = this.guild.roles.get(this.guildID) as Role;
    const roles: Role[] = [everyoneRole];

    for (const roleId of this.roles) {
      const role = this.guild.roles.get(roleId);

      if (!role) continue;

      roles.push(role);
    }

    return roles.sort((a, b) => b.position - a.position)[0];
  },
});
