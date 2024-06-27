"use client";

import { NextPage } from "next";
import { VoiceMessage } from "../components/VoiceMessage";

const Home: NextPage = () => {
  const maxRecordingLength = 300;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Voice Message POC</h1>
      <VoiceMessage maxRecordingLength={maxRecordingLength} />
    </div>
  );
};

export default Home;
