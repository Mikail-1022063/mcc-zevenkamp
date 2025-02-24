"use client";

import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash, Plus, Search } from "lucide-react";
import { toast } from "react-hot-toast";

const client = generateClient();

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewMember, setIsNewMember] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const { data, errors } = await client.models.Member.list({
      selectionSet: [
        "id",
        "name",
        "surname",
        "address",
        "email",
        "phone",
        "iban",
        "status",
        "machtiging",
        "payments.*",
      ],
    });
    if (errors) {
      console.error(errors);
      return;
    }
    setMembers(data || []);
  };

  const handleEditClick = (member = null) => {
    setIsNewMember(!member);
    setSelectedMember(
      member || {
        name: "",
        surname: "",
        address: "",
        email: "",
        phone: "",
        iban: "",
        status: "Active",
        machtiging: false,
      },
    );
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedMember.name || !selectedMember.email) {
      toast.error("Naam en Email zijn verplicht!");
      return;
    }

    if (isNewMember) {
      const { errors } = await client.models.Member.create(selectedMember);
      if (errors) {
        console.error(errors);
        toast.error("Fout bij het aanmaken van het lid.");
        return;
      }
      toast.success("Lid succesvol aangemaakt!");
    } else {
      const { errors } = await client.models.Member.update(selectedMember);
      if (errors) {
        console.error(errors);
        toast.error("Fout bij het bijwerken van het lid.");
        return;
      }
      toast.success("Lid succesvol bijgewerkt!");
    }
    loadMembers();
    setIsDialogOpen(false);
  };

  const handleDelete = async (id) => {
    const { errors } = await client.models.Member.delete({ id });
    if (errors) {
      console.error(errors);
      toast.error("Fout bij het verwijderen van het lid.");
      return;
    }
    toast.success("Lid succesvol verwijderd!");
    loadMembers();
  };

  const filteredMembers = members.filter((member) => {
    const term = searchTerm.toLowerCase();
    return (
      member.name.toLowerCase().includes(term) ||
      member.surname.toLowerCase().includes(term) ||
      member.email.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leden</h1>
      <div className="flex justify-between items-center">
        <Button
          className="mb-4 cursor-pointer"
          onClick={() => handleEditClick()}
        >
          <Plus className="mr-2 h-4 w-4" /> Nieuw Lid
        </Button>
        <div className="relative mb-4 w-1/5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Zoeken op naam of email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Naam</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Machtiging</TableHead>
              <TableHead>Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  {member.name} {member.surname}
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-white text-xs font-bold ${
                      member.status === "Active"
                        ? "bg-green-500"
                        : member.status === "OnHold"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  >
                    {member.status || "Geen status"}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-white text-xs font-bold ${
                      member.machtiging ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    {member.machtiging ? "✅ Gemachtigd" : "❌ Niet gemachtigd"}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 cursor-pointer"
                      >
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleEditClick(member)}
                      >
                        ✏️ Bewerken
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Verwijderen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedMember && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isNewMember ? "➕ Nieuw Lid" : "📝 Lid Bewerken"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Naam *"
                value={selectedMember.name}
                onChange={(e) =>
                  setSelectedMember({ ...selectedMember, name: e.target.value })
                }
                required
              />
              <Input
                placeholder="Achternaam *"
                value={selectedMember.surname}
                onChange={(e) =>
                  setSelectedMember({
                    ...selectedMember,
                    surname: e.target.value,
                  })
                }
                required
              />
              <Input
                placeholder="Adres"
                value={selectedMember.address}
                onChange={(e) =>
                  setSelectedMember({
                    ...selectedMember,
                    address: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Email *"
                value={selectedMember.email}
                onChange={(e) =>
                  setSelectedMember({
                    ...selectedMember,
                    email: e.target.value,
                  })
                }
                required
              />
              <Input
                placeholder="Telefoon"
                value={selectedMember.phone}
                onChange={(e) =>
                  setSelectedMember({
                    ...selectedMember,
                    phone: e.target.value,
                  })
                }
              />
              <Input
                placeholder="IBAN"
                value={selectedMember.iban}
                onChange={(e) =>
                  setSelectedMember({ ...selectedMember, iban: e.target.value })
                }
              />
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedMember.machtiging}
                  onCheckedChange={(checked) =>
                    setSelectedMember({
                      ...selectedMember,
                      machtiging: checked,
                    })
                  }
                  className="cursor-pointer"
                />
                <span>Machtiging Gegeven</span>
              </div>

              {!isNewMember && (
                <>
                  <h2 className="text-lg font-semibold mt-4">💰 Betalingen</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bedrag</TableHead>
                        <TableHead>Datum</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedMember.payments?.length > 0 ? (
                        selectedMember.payments.map((payment, index) => (
                          <TableRow key={index}>
                            <TableCell>€ {payment.amount}</TableCell>
                            <TableCell>{payment.date}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan="2" className="text-center">
                            Geen betalingen gevonden.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </>
              )}
            </div>
            <DialogFooter>
              <Button className="cursor-pointer" onClick={handleSave}>
                💾 Opslaan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
