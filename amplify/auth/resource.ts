import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    givenName: {
      mutable: true,
      required: true,
    },
    familyName: {
      mutable: true,
      required: true,
    },
    birthdate: {
      mutable: true,
      required: true,
    },
    "custom:iban": {
      dataType: "String",
      mutable: true,
    },
    "custom:iban_authorization": {
      dataType: "Boolean",
      mutable: true,
    },
    "custom:woonadres": {
      dataType: "String",
      mutable: true,
    },
  },
});
