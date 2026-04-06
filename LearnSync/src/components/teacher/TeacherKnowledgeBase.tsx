"use client";

import { useEffect, useRef, useState } from "react";

const TEACHER_SYLLABUS_STORAGE_KEY = "learnsync-teacher-syllabus-uri";

type UploadContextResponse = {
  fileUri: string;
};

type Props = {
  syllabusFileUri: string | null;
  onSyllabusFileUri: (uri: string | null) => void;
};

export function TeacherKnowledgeBase({ syllabusFileUri, onSyllabusFileUri }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (syllabusFileUri) {
      return;
    }

    const storedUri = window.localStorage.getItem(TEACHER_SYLLABUS_STORAGE_KEY);
    if (storedUri && storedUri.trim()) {
      onSyllabusFileUri(storedUri);
    }
  }, [syllabusFileUri, onSyllabusFileUri]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-context", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Failed to upload teacher syllabus context");
      }

      const payload = (await response.json()) as UploadContextResponse;
      const uri = payload.fileUri ?? null;
      onSyllabusFileUri(uri);
      if (uri) {
        window.localStorage.setItem(TEACHER_SYLLABUS_STORAGE_KEY, uri);
        window.dispatchEvent(new Event("learnsync-syllabus-updated"));
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unexpected upload error");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <section>
      <h2>Teacher Knowledge Base</h2>
      <p>Upload class syllabus context for teacher-side AI chat.</p>
      <button type="button" onClick={handleUploadClick} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload Syllabus"}
      </button>
      <input ref={fileInputRef} type="file" accept=".pdf,.txt,.md" hidden onChange={handleFileSelection} />
      {syllabusFileUri ? <p>Connected context: {syllabusFileUri}</p> : <p>No syllabus uploaded yet.</p>}
      {error ? <p role="alert">{error}</p> : null}
    </section>
  );
}
