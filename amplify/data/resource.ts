import { a, defineData, type ClientSchema } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource.js";

const schema = a
  .schema({
    Member: a
      .model({
        id: a.id(),
        name: a.string(),
        surname: a.string(),
        address: a.string(),
        email: a.string(),
        phone: a.string(),
        iban: a.string(),
        status: a.enum(["Active", "OnHold", "Inactive"]),
        machtiging: a.boolean().default(false),
        payments: a.hasMany("Payment", "memberId"),
      })
      .authorization((allow) => [
        allow.owner(),
        allow.groups(["Admin", "Member"]),
      ]),

    Payment: a
      .model({
        id: a.id(),
        memberId: a.id(),
        amount: a.float(),
        date: a.string(),
        member: a.belongsTo("Member", "memberId"),
      })
      .authorization((allow) => [allow.owner(), allow.groups(["Admin"])]),
  })
  .authorization((allow) => [allow.resource(postConfirmation)]);

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({ schema });
