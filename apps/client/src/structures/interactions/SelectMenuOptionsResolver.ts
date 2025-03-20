import type { Collection } from "@discordeno/bot";
import type { Interaction, MaybeOptional, User } from "@util/types.js";

export class SelectMenuOptionsResolver {
  private readonly resolvedUsersCollection: MaybeOptional<UsersCollection>;
  private readonly values: string[];

  constructor(interaction: Interaction) {
    const { data } = interaction;
    const { values, resolved } = data ?? {};
    const { users } = resolved ?? {};

    this.resolvedUsersCollection = users;
    this.values = values ?? [];
  }

  getResolvedCollections(): ResolvedCollections {
    const { resolvedUsersCollection } = this;

    return {
      users: resolvedUsersCollection,
    };
  }

  /**
   * Gets the string values.
   * @returns An array containing the string values.
   */
  getStrings(): string[] {
    const values = this.getValues();

    return values;
  }

  /**
   * Gets the resolved user objects from the interaction.
   * @returns An array containing the resolved user objects.
   */
  getUsers(): User[] {
    const values = this.getValues();
    const { users } = this.getResolvedCollections();
    const resolvedUsers = values.map((value) => {
      const userIdBigInt = BigInt(value);
      const user = users?.get(userIdBigInt);

      return user;
    });

    return resolvedUsers.filter((value) => value !== undefined);
  }

  /**
   * Gets the raw values.
   * @returns An array containing the raw values.
   */
  private getValues(): string[] {
    return this.values;
  }
}

type UsersCollection = Collection<bigint, User>;

interface ResolvedCollections {
  users?: UsersCollection;
}
