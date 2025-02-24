import React, { useEffect, useState } from "react";
import {
  fetchUserAttributes,
  updateUserAttributes,
  confirmUserAttribute,
  sendUserAttributeVerificationCode,
} from "aws-amplify/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

import { generateClient } from "aws-amplify/data";
const client = generateClient();

export default function AccountPage() {
  const [userAttributes, setUserAttributes] = useState({});
  const [userId, setUserId] = useState(null);
  const [editableAttribute, setEditableAttribute] = useState({
    key: "",
    value: "",
  });
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [iban, setIban] = useState("");
  const [hasAuthorization, setHasAuthorization] = useState(false);

  const loadUserAttributes = async () => {
    try {
      const attributes = await fetchUserAttributes();
      const filteredAttributes = {
        sub: attributes.sub,
        email: attributes.email,
        given_name: attributes.given_name,
        family_name: attributes.family_name,
        birthdate: attributes.birthdate,
        "custom:iban": attributes["custom:iban"] || "",
        "custom:iban_authorization":
          attributes["custom:iban_authorization"] === "true",
        "custom:woonadres": attributes["custom:woonadres"] || "",
      };
      setUserAttributes(filteredAttributes);
      setIban(filteredAttributes["custom:iban"]);
      setHasAuthorization(filteredAttributes["custom:iban_authorization"]);
      setUserId(attributes.sub);
    } catch (error) {
      console.error("Failed to fetch user attributes:", error);
    }
  };

  useEffect(() => {
    loadUserAttributes();
  }, []);

  const syncToAWSData = async (updatedAttributes) => {
    const attributes = updatedAttributes || userAttributes;
    if (!userId) {
      console.error("User ID not available for AWS data sync");
      return;
    }
    const updateData = {
      id: userId,
      email: attributes.email,
      name: attributes.given_name,
      surname: attributes.family_name,
      address: attributes["custom:woonadres"],
      iban: attributes["custom:iban"],
      machtiging: attributes["custom:iban_authorization"],
    };
    try {
      const { data, errors } = await client.models.Member.update(updateData);
      if (errors && errors.length > 0) {
        console.error("Error updating AWS data:", errors);
        toast.error("Er is iets misgegaan bij het updaten van AWS data.");
      } else {
        console.log("AWS data updated successfully:", data);
      }
    } catch (error) {
      console.error("Exception updating AWS data:", error);
      toast.error("Er is iets misgegaan bij het updaten van AWS data.");
    }
  };

  const handleInputChange = (key, value) => {
    setEditableAttribute({ key, value });
    setIsDialogOpen(true);

    if (key === "email" || key === "phone_number") {
      toast(`⚠️ Verificatiecode kan vereist zijn voor ${key}`);
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (!editableAttribute.key) {
        console.error("No attribute selected for updating.");
        return;
      }
      const updated = {
        ...userAttributes,
        [editableAttribute.key]: editableAttribute.value,
      };
      const result = await updateUserAttributes({
        userAttributes: {
          [editableAttribute.key]: editableAttribute.value,
        },
      });
      if (
        result.nextStep &&
        result.nextStep.updateAttributeStep === "CONFIRM_ATTRIBUTE_WITH_CODE"
      ) {
        toast(
          `⚠️ Verificatiecode is vereist en is verzonden naar uw e-mail. De wijzigingen worden pas toegepast na bevestiging.`,
        );
      } else {
        toast.success("Wijzigingen succesvol opgeslagen!");
        setUserAttributes(updated);
      }
      await syncToAWSData(updated);
      setIsDialogOpen(false);
      console.log("User attribute updated successfully.");
    } catch (error) {
      console.error("Failed to update user attribute:", error);
    }
  };

  const handleSaveIBAN = async () => {
    try {
      const updated = {
        ...userAttributes,
        "custom:iban": iban,
        "custom:iban_authorization": hasAuthorization,
      };
      const result = await updateUserAttributes({
        userAttributes: {
          "custom:iban": iban,
          "custom:iban_authorization": hasAuthorization.toString(),
        },
      });
      if (
        result.nextStep &&
        result.nextStep.updateAttributeStep === "CONFIRM_ATTRIBUTE_WITH_CODE"
      ) {
        toast(
          `⚠️ Verificatiecode is vereist en is verzonden naar uw e-mail. De wijzigingen worden pas toegepast na bevestiging.`,
        );
      } else {
        toast.success("IBAN en machtiging succesvol opgeslagen!");
        setUserAttributes(updated);
      }
      await syncToAWSData(updated);
    } catch (error) {
      console.error("Failed to update IBAN:", error);
      toast.error("Er is iets misgegaan bij het opslaan van de IBAN.");
    }
  };

  const handleConfirmUserAttribute = async () => {
    try {
      await confirmUserAttribute({
        userAttributeKey: editableAttribute.key,
        confirmationCode,
      });
      toast.success(
        "Attribuut succesvol bevestigd. De wijziging is nu toegepast.",
      );
      await loadUserAttributes();
      await syncToAWSData();
    } catch (error) {
      console.error("Error confirming attribute:", error);
    }
  };

  const handleSendVerificationCode = async (key) => {
    try {
      await sendUserAttributeVerificationCode({ userAttributeKey: key });
      toast.success(`Een verificatiecode is verzonden voor ${key}`);
    } catch (error) {
      console.error("Error sending verification code:", error);
    }
  };

  const displayNameMap = {
    email: "Email",
    given_name: "Voornaam",
    family_name: "Achternaam",
    birthdate: "Geboortedatum",
    "custom:iban": "IBAN",
    "custom:iban_authorization": "IBAN Machtiging",
    "custom:woonadres": "Woonadres",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mijn account</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Attribuut</TableHead>
              <TableHead>Waarde</TableHead>
              <TableHead>Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(userAttributes).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell>{displayNameMap[key] || key}</TableCell>
                <TableCell>
                  {key === "custom:iban_authorization"
                    ? value?.toString() === "true"
                      ? "Gemachtigd"
                      : "Niet gemachtigd"
                    : key === "custom:woonadres" && !value
                      ? "Geen woonadres opgegeven"
                      : value}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => handleInputChange(key, value)}
                  >
                    Bewerken
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">IBAN Machtiging</h2>
        <div className="flex items-center gap-4">
          <Input
            className="border p-2 w-64"
            placeholder="Voer uw IBAN in"
            value={iban}
            onChange={(e) => setIban(e.target.value)}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hasAuthorization}
              onChange={(e) => setHasAuthorization(e.target.checked)}
            />
            Machtiging geven
          </label>
          <Button
            className="bg-blue-600 text-white px-4 py-2 cursor-pointer"
            onClick={handleSaveIBAN}
          >
            IBAN opslaan
          </Button>
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (open && editableAttribute.key === "custom:iban_authorization") {
            setHasAuthorization(editableAttribute.value === "true");
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Attribuut bewerken</DialogTitle>
            <DialogDescription>
              Wijzig hier uw attribuut. Klik op opslaan wanneer u klaar bent.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attributeKey" className="text-right">
                Attribuut
              </Label>
              <Input
                id="attributeKey"
                value={displayNameMap[editableAttribute.key] || ""}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attributeValue" className="text-right">
                Nieuwe waarde
              </Label>
              <Input
                id="attributeValue"
                value={editableAttribute.value}
                onChange={(e) =>
                  setEditableAttribute({
                    ...editableAttribute,
                    value: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            {editableAttribute.key === "custom:iban_authorization" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="iban_authorization" className="text-right">
                  IBAN Machtiging
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="iban_authorization"
                    checked={hasAuthorization}
                    onChange={(e) => {
                      setHasAuthorization(e.target.checked);
                      setEditableAttribute({
                        ...editableAttribute,
                        value: e.target.checked.toString(),
                      });
                    }}
                    className="cursor-pointer"
                  />
                  <span>
                    {hasAuthorization ? "Gemachtigd" : "Niet gemachtigd"}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              className="cursor-pointer"
              onClick={handleSaveChanges}
            >
              Wijzigingen opslaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-6 flex items-center gap-4">
        <Input
          className="border p-2 w-35"
          placeholder="Verificatiecode"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
        />
        <Button
          className="bg-green-600 text-white px-4 py-2 cursor-pointer"
          onClick={handleConfirmUserAttribute}
        >
          Opslaan
        </Button>
      </div>
    </div>
  );
}
