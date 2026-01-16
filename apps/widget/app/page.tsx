"use client";

import { use } from "react";
import { WidgetView } from "@/modules/widget/ui/views/wideget-view";
import { NextPage } from "next";

interface Props {
  searchParams: Promise<{
    organizationId: string;
  }>;
}

const Page = ({ searchParams }: Props) => {
  const { organizationId } = use(searchParams);
  return <WidgetView organizationId={organizationId} />;
};

export default Page;
