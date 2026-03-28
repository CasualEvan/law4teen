import React, { useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VoiceButton({ text, label = "Listen" }) {
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  const handleSpeak = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSpeak}
      className={`gap-2 font-play border-gold/30 text-gold-dark hover:bg-gold/10 hover:text-gold-dark ${
        speaking ? "bg-gold/15 border-gold/50" : ""
      }`}
    >
      {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      {speaking ? "Stop" : label}
    </Button>
  );
}