import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  Member: a
    .model({
      id: a.id(),
      name: a.string(),
      address: a.string(),
      email: a.string(),
      phone: a.string(),
      iban: a.string(),
      status: a.enum(["Active", "OnHold", "Inactive"]),
      machtiging: a.boolean().default(false),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.groups(["Admin", "Member"]),
    ]),

  Payment: a
    .model({
      id: a.id(),
      memberId: a.string(),
      amount: a.float(),
      date: a.string(),
    })
    .authorization((allow) => [allow.owner(), allow.groups(["Admin"])]),
});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
});
