"use client";

import {
  GlobeIcon,
  PhoneCallIcon,
  PhoneIcon,
  WorkflowIcon,
} from "lucide-react";
import { PluginCard, type Feature } from "../components/plugin-card";
import { api } from "@workspace/backend/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";

const vapiFeatures: Feature[] = [
  {
    label: "Web voice calls",
    icon: GlobeIcon,
    description: "Voice chat directly in your app.",
  },
  {
    label: "Phone numbers",
    icon: PhoneIcon,
    description: "Get dedicated business lines",
  },
  {
    label: "Outbound calls",
    icon: PhoneCallIcon,
    description: "Automated customer outreach",
  },
  {
    icon: WorkflowIcon,
    label: "Workflows",
    description: "Custom conversation flows",
  },
];

const formSchema = z.object({
  publicApiKey: z.string().min(1, "Public API key is required"),
  privateApiKey: z.string().min(1, "Private API key is required"),
});

const VapiPluginForm = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const upsertSecret = useMutation(api.private.secrets.upsert);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publicApiKey: "",
      privateApiKey: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await upsertSecret({
        service: "vapi",
        value: data,
      });
      setOpen(false);
      toast.success("Vapi plugin connected successfully");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enable Vapi</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Your API keys are safely encrypted and stored using AWS Secrets
          Manager.
        </DialogDescription>
        <Form {...form}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="publicApiKey"
              render={({ field }) => (
                <FormItem>
                  <Label>Public API Key</Label>
                  <FormControl>
                    <Input
                      placeholder="Your public API key"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="privateApiKey"
              render={({ field }) => (
                <FormItem>
                  <Label>Private API Key</Label>
                  <FormControl>
                    <Input
                      placeholder="Your private API key"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Connecting..." : "Connect"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const VapiView = () => {
  const vapiPlugin = useQuery(api.private.plugins.getOne, { service: "vapi" });
  const [connectOpen, setConnectOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const handleSubmit = () => {
    if (vapiPlugin) {
      setRemoveOpen(true);
    } else {
      setConnectOpen(true);
    }
  };
  return (
    <>
      <VapiPluginForm open={connectOpen} setOpen={setConnectOpen} />
      <div className="flex min-h-screen flex-col bg-muted p-8">
        <div className="mx-auto w-full max-w-screen-md">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Vapi Plugin</h1>
            <p className="text-muted-foreground">
              Connect Vapi to enable AI voice calls and phone support
            </p>
          </div>
          <div className="mt-8">
            {vapiPlugin ? (
              <>Connected!!</>
            ) : (
              <PluginCard
                serviceName="Vapi"
                serviceImage="/vapi.jpg"
                features={vapiFeatures}
                isDisabled={vapiPlugin === undefined}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
