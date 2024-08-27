import "dotenv/config";
import { Member, type Role, User } from "oceanic.js";
import { Discord } from "#client";

export const client = new Discord();

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
