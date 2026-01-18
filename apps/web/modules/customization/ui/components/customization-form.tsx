import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import { Separator } from "@workspace/ui/components/separator";
import { Textarea } from "@workspace/ui/components/textarea";
import type { Doc } from "@workspace/backend/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { toast } from "sonner";
import { VapiFormFields } from "./vapi-form-fields";
import { widgetSettingsSchema } from "../../schemas";
import type { FormSchema } from "../../types";

type WidgetSettings = Doc<"widgetSettings">;

interface CustomizationFormProps {
  initialData?: WidgetSettings | null;
  hasVapiPlugin: boolean;
}

export const CustomizationForm = ({
  initialData,
  hasVapiPlugin,
}: CustomizationFormProps) => {
  const upsertWidgetSettings = useMutation(api.private.widgetSettings.upsert);

  const form = useForm<FormSchema>({
    resolver: zodResolver(widgetSettingsSchema),
    defaultValues: {
      greetMessage:
        initialData?.greetMessage ?? "Hi there! How can I help you today?",
      defaultSuggestions: {
        suggestion1: initialData?.defaultSuggestions?.suggestion1 ?? "",
        suggestion2: initialData?.defaultSuggestions?.suggestion2 ?? "",
        suggestion3: initialData?.defaultSuggestions?.suggestion3 ?? "",
      },
      vapiSettings: {
        assistantId: initialData?.vapiSettings?.assistantId ?? "",
        phoneNumber: initialData?.vapiSettings?.phoneNumber ?? "",
      },
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      const vapiSettings: WidgetSettings["vapiSettings"] = {
        assistantId:
          data.vapiSettings.assistantId === "none"
            ? ""
            : data.vapiSettings.assistantId,
        phoneNumber:
          data.vapiSettings.phoneNumber === "none"
            ? ""
            : data.vapiSettings.phoneNumber,
      };
      await upsertWidgetSettings({
        greetMessage: data.greetMessage,
        defaultSuggestions: data.defaultSuggestions,
        vapiSettings,
      });
      toast.success("Widget settings updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update widget settings");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>General Chat Settings</CardTitle>
            <CardDescription>
              Configure basic chat widget behavior and messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="greetMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Greeting Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Welcome message shown when chat opens"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The first message customer sees when they open the chat
                    widget
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <div className="space-y-4">
              <div>
                <h3 className="mb-4 text-sm">Default Suggestions</h3>
                <p className="mb-4 text-muted-foreground">
                  Quick reply suggestions show to customers to help guide the
                  conversation
                </p>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 1</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., How do i get started?"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 2</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., What are your pricing plans?"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 3</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., I need help with my account"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {hasVapiPlugin && (
          <Card>
            <CardHeader>
              <CardTitle>Voice Assistant Settings</CardTitle>
              <CardDescription>
                Configure voice calling features powered by Vapi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <VapiFormFields form={form} />
            </CardContent>
          </Card>
        )}
        <div className="flex justify-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Saving..." : "Save settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
