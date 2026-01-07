"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";

export default function Page() {
  const users = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.add);
  const [name, setName] = useState("");
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <p>app/widget</p>
      <Input
        className="max-w-sm w-full mx-auto my-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={() => addUser({ name: name.trim() })}>Add User</Button>
      <p className="max-w-sm w-full mx-auto">
        {JSON.stringify(users, null, 2)}
      </p>
    </div>
  );
}
