"use client";

import { useMutation, useQuery } from "convex/react";
import { Input } from "@workspace/ui/components/input";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function Page() {
  const users = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.add);
  const [name, setName] = useState("");
  return (
    <>
      <Authenticated>
        <div className="flex flex-col items-center justify-center min-h-svh">
          <UserButton />
          <p>app/web</p>
          <Input
            className="max-w-sm w-full mx-auto my-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={() => addUser({ name: name.trim() })}>
            Add User
          </Button>
          <p className="max-w-sm w-full mx-auto">
            {JSON.stringify(users, null, 2)}
          </p>
        </div>
      </Authenticated>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
    </>
  );
}
