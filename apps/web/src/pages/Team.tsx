import { useEffect, useState } from "react";

import {
  getMembers,
  addMember,
  updateMember,
  removeMember,
} from "../api/member.api";

interface Member {
  id: string;
  userId: string;
  organizationId: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MANAGER" | "MEMBER";
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
}

export default function Team() {
  const [members, setMembers] = useState<Member[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");

  const [adding, setAdding] = useState(false);

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function loadMembers() {
    try {
      setError("");

      const response = await getMembers();

      setMembers(response.data ?? response);
    } catch (error: any) {
      console.error("MEMBERS LOAD ERROR:", error);

      setError(error?.response?.data?.message || "Unable to load team members");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMembers();
  }, []);

  async function handleAddMember(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setAdding(true);

      setError("");

      await addMember({
        name: name.trim(),
        email: email.trim(),
        role,
      });

      setName("");

      setEmail("");

      setRole("MEMBER");

      await loadMembers();
    } catch (error: any) {
      console.error("ADD MEMBER ERROR:", error);

      setError(error?.response?.data?.message || "Unable to add member");
    } finally {
      setAdding(false);
    }
  }

  async function handleRoleChange(
    membershipId: string,
    newRole: "ADMIN" | "MEMBER",
  ) {
    try {
      setActionLoading(membershipId);

      setError("");

      await updateMember(membershipId, {
        role: newRole,
      });

      await loadMembers();
    } catch (error: any) {
      console.error("UPDATE MEMBER ERROR:", error);

      setError(error?.response?.data?.message || "Unable to update member");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRemoveMember(membershipId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this member?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(membershipId);

      setError("");

      await removeMember(membershipId);

      await loadMembers();
    } catch (error: any) {
      console.error("REMOVE MEMBER ERROR:", error);

      setError(error?.response?.data?.message || "Unable to remove member");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return <div className="p-6">Loading team...</div>;
  }

  return (
    <div className="p-6">
      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">Team</h1>

        <p className="text-gray-500 mt-2">Manage your organization members</p>
      </div>

      {/* ERROR */}

      {error && (
        <div
          className="
            mt-6
            bg-red-50
            border
            border-red-200
            text-red-600
            rounded-lg
            p-4
          "
        >
          {error}
        </div>
      )}

      {/* ADD MEMBER */}

      <div
        className="
          mt-8
          bg-white
          border
          rounded-xl
          p-6
        "
      >
        <h2 className="text-xl font-semibold">Add Member</h2>

        <p className="text-gray-500 mt-1">
          Add a new member to your organization.
        </p>

        <form
          onSubmit={handleAddMember}
          className="
            mt-5
            flex
            flex-col
            md:flex-row
            gap-3
          "
        >
          {/* NAME */}

          <input
            type="text"
            placeholder="Member name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="
              border
              rounded-lg
              px-4
              py-3
              flex-1
              outline-none
            "
          />

          {/* EMAIL */}

          <input
            type="email"
            placeholder="Member email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="
              border
              rounded-lg
              px-4
              py-3
              flex-1
              outline-none
            "
          />

          {/* ROLE */}

          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value as "ADMIN" | "MEMBER")
            }
            className="
              border
              rounded-lg
              px-4
              py-3
            "
          >
            <option value="MEMBER">Member</option>

            <option value="ADMIN">Admin</option>
          </select>

          {/* ADD BUTTON */}

          <button
            type="submit"
            disabled={adding}
            className="
              bg-black
              text-white
              px-6
              py-3
              rounded-lg
              disabled:opacity-50
            "
          >
            {adding ? "Adding..." : "Add Member"}
          </button>
        </form>
      </div>

      {/* MEMBERS */}

      <div
        className="
          mt-8
          bg-white
          border
          rounded-xl
          overflow-hidden
        "
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Organization Members</h2>
        </div>

        {members.length === 0 ? (
          <div className="p-6 text-gray-500">No members found.</div>
        ) : (
          <div>
            {members.map((member) => (
              <div
                key={member.id}
                className="
                  p-6
                  border-b
                  last:border-b-0
                  flex
                  flex-col
                  md:flex-row
                  md:items-center
                  md:justify-between
                  gap-4
                "
              >
                {/* MEMBER INFO */}

                <div>
                  <p className="font-semibold">{member.name}</p>

                  <p className="text-gray-500 text-sm">{member.email}</p>

                  <p className="text-sm mt-1">
                    Status:
                    <span className="ml-2 font-medium">{member.status}</span>
                  </p>
                </div>

                {/* ROLE + ACTIONS */}

                <div className="flex items-center gap-3">
                  {member.role === "OWNER" ? (
                    <span
                      className="
                        bg-black
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        text-sm
                      "
                    >
                      OWNER
                    </span>
                  ) : (
                    <>
                      <select
                        value={member.role}
                        disabled={actionLoading === member.id}
                        onChange={(event) =>
                          handleRoleChange(
                            member.id,
                            event.target.value as "ADMIN" | "MEMBER",
                          )
                        }
                        className="
                          border
                          rounded-lg
                          px-3
                          py-2
                        "
                      >
                        <option value="MEMBER">MEMBER</option>

                        <option value="ADMIN">ADMIN</option>
                      </select>

                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={actionLoading === member.id}
                        className="
                          border
                          border-red-500
                          text-red-500
                          px-4
                          py-2
                          rounded-lg
                          disabled:opacity-50
                        "
                      >
                        {actionLoading === member.id ? "Removing..." : "Remove"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
