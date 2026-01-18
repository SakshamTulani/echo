"use client";
import { useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";
import { useAtomValue } from "jotai";
import { vapiSecretsAtom, widgetSettingsAtom } from "../atoms/widget-atoms";
type TranscriptMessage = {
  role: "user" | "assistant";
  text: string;
};

export const useVapi = () => {
  const vapiSecrets = useAtomValue(vapiSecretsAtom);
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<Array<TranscriptMessage>>([]);

  useEffect(() => {
    if (!vapiSecrets) {
      return;
    }
    const vapiInstance = new Vapi(vapiSecrets.publicApiKey);
    setVapi(vapiInstance);

    // Event listeners
    vapiInstance.on("call-start", () => {
      console.log("Call started");
      setIsConnected(true);
      setIsConnecting(false);
      setTranscript([]);
    });

    vapiInstance.on("call-end", () => {
      console.log("Call ended");
      setIsConnected(false);
      setIsSpeaking(false);
      setIsConnecting(false);
    });

    vapiInstance.on("speech-start", () => {
      console.log("Assistant started speaking");
      setIsSpeaking(true);
    });

    vapiInstance.on("speech-end", () => {
      console.log("Assistant stopped speaking");
      setIsSpeaking(false);
    });

    vapiInstance.on("message", (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setTranscript((prev) => [
          ...prev,
          {
            role: message.role === "user" ? "user" : "assistant",
            text: message.transcript,
          },
        ]);
      }
    });

    vapiInstance.on("error", (error) => {
      console.error("Vapi error:", error);
      setIsConnecting(false);
    });

    return () => {
      vapiInstance?.stop();
    };
  }, [vapiSecrets]);

  const startCall = () => {
    if (
      !vapiSecrets ||
      !widgetSettings ||
      !widgetSettings.vapiSettings.assistantId
    ) {
      return;
    }
    setIsConnecting(true);
    if (vapi) {
      vapi.start(widgetSettings.vapiSettings.assistantId);
    }
  };

  const endCall = () => {
    if (vapi) {
      vapi.stop();
    }
  };
  return {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startCall,
    endCall,
  };
};
