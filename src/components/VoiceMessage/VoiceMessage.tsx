import React, { FC, useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa6";

interface VoiceMessageProps {
  maxRecordingLength: number; // in seconds, configurable through ENV
}

export const VoiceMessage: FC<VoiceMessageProps> = ({ maxRecordingLength }) => {
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [recording, setRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(maxRecordingLength);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const audioFiles = acceptedFiles.filter((file) =>
        file.type.startsWith("audio/")
      );
      setAudioFiles((prevFiles) => [...prevFiles, ...audioFiles]);
    },
    accept: {
      "audio/*": [".wav", ".mp3", ".webm"],
    },
  });

  useEffect(() => {
    if (timeLeft <= 0 && recording) {
      handleStopRecording();
    }
  }, [timeLeft, recording]);

  const handleStartRecording = async () => {
    try {
      let mimeType = "";
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/wav")) {
        mimeType = "audio/wav";
      } else if (MediaRecorder.isTypeSupported("audio/mpeg")) {
        mimeType = "audio/mpeg";
      } else {
        alert("No supported audio formats found. Recording cannot start.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType });
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioBlob(event.data);
        }
      };

      recorder.start();
      setRecording(true);
      setTimeLeft(maxRecordingLength);
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing media devices.", err);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleUpload = () => {
    if (audioBlob) {
      const file = new File([audioBlob], `recording-${Date.now()}.webm`, {
        type: "audio/webm",
      });
      setAudioFiles((prevFiles) => [...prevFiles, file]);
      setAudioBlob(null);
      alert("Audio file uploaded successfully.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow rounded-lg">
      <div
        className={`p-4 mb-4 rounded cursor-pointer text-center transition-colors ${
          recording ? "bg-red-100" : "bg-blue-100"
        }`}
        onClick={recording ? handleStopRecording : handleStartRecording}
      >
        <div className="flex justify-center items-center gap-2 text-blue-700">
          <FaMicrophone size={24} />
          {recording ? `Stop Recording (${timeLeft}s)` : "Record Voice Message"}
        </div>
      </div>

      {audioBlob && (
        <div className="mt-4 text-center">
          <audio ref={audioRef} controls className="w-full">
            <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
          <button
            onClick={handleUpload}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FaCloudUploadAlt size={20} className="inline-block mr-2" />
            Upload Recording
          </button>
        </div>
      )}

      <div
        className={`p-4 mt-4 rounded cursor-pointer text-center transition-colors ${
          isDragActive ? "bg-green-100" : "bg-gray-100"
        }`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="flex justify-center items-center gap-2 text-gray-700">
          <FaCloudUploadAlt size={24} />
          Upload Pre-recorded Audio
        </div>
      </div>

      {audioFiles.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Uploaded Audio Files</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">File Name</th>
                  <th className="px-4 py-2 text-left">Playback</th>
                </tr>
              </thead>
              <tbody>
                {audioFiles.map((file) => (
                  <tr key={file.name}>
                    <td className="border px-4 py-2">{file.name}</td>
                    <td className="border px-4 py-2">
                      <audio controls className="w-full">
                        <source
                          src={URL.createObjectURL(file)}
                          type={file.type}
                        />
                        Your browser does not support the audio element.
                      </audio>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
