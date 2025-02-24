import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { type Schema } from "../../data/resource.js";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import * as AWS from "aws-sdk";

const env = process.env;

async function configureAmplify() {
  const { resourceConfig, libraryOptions } =
    await getAmplifyDataClientConfig(env);
  Amplify.configure(resourceConfig, libraryOptions);
}
await configureAmplify();

const client = generateClient<Schema>();

export const handler: PostConfirmationTriggerHandler = async (event) => {
  try {
    const userEmail = event.request.userAttributes.email;
    const userName = event.request.userAttributes.given_name || "Nieuw Lid";
    const userSurname = event.request.userAttributes.family_name || "";
    const userId = event.request.userAttributes.sub;

    await client.models.Member.create({
      id: userId,
      name: userName,
      surname: userSurname,
      email: userEmail,
      status: "Active",
      machtiging: false,
    });

    const cognito = new AWS.CognitoIdentityServiceProvider();
    await cognito
      .adminAddUserToGroup({
        GroupName: "Member",
        UserPoolId: event.userPoolId,
        Username: event.userName,
      })
      .promise();

    console.log(
      `Member created successfully for ${userEmail} and added to group "Member"`,
    );
  } catch (error) {
    console.error("Error in post confirmation handler:", error);
  }

  return event;
};
