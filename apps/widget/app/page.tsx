"use client";

import { useVapi } from "@/modules/widget/hooks/use-vapi";
import { Button } from "@workspace/ui/components/button";

// This is for Testing only this will be white labeled later
const vapiTestData = {
  apiKey: process.env.NEXT_PUBLIC_VAPI_API_KEY,
  assistantId: process.env.NEXT_PUBLIC_ASSISTANT_ID,
};

export default function Page() {
  const {
    endCall,
    isConnected,
    isConnecting,
    isSpeaking,
    startCall,
    transcript,
  } = useVapi(vapiTestData);

  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <Button onClick={() => startCall()}>Start Call</Button>
      <Button onClick={() => endCall()} variant={"destructive"}>
        End Call
      </Button>
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold">Is Connected</div>
          <div className="text-sm">{isConnected ? "Yes" : "No"}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold">Is Connecting</div>
          <div className="text-sm">{isConnecting ? "Yes" : "No"}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold">Is Speaking</div>
          <div className="text-sm">{isSpeaking ? "Yes" : "No"}</div>
        </div>
      </div>

      <p>Transcript</p>
      {JSON.stringify(transcript, null, 2)}
    </div>
  );
}
