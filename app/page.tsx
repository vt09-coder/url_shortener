"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Copy, Check } from "lucide-react";

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // url validation from the frontend side
  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // clears the text
  const textClear = () => {
    setOriginalUrl("");
    setShortUrl("");
    setError("");
  };

  // copies the url to clipboard
  const copyUrl = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
      setError("Failed to copy");
    }
  };

  // sends the original url and returns the short url from the backend
  const handleShorten = async () => {
    setError("");

    if (!originalUrl.trim()) {
      setError("URL cannot be empty");
      return;
    }

    if (!validateUrl(originalUrl)) {
      setError("Invalid URL");
      return;
    }

    try {
  setLoading(true);

  const res = await fetch("/api/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ originalUrl}),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  setShortUrl(data.shortUrl);
  setCopied(false);

} catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Something went wrong");
  }
} finally {
  setLoading(false);
}
  };

  // ui
  return (
    <div className="flex min-h-screen items-center justify-center p-7 bg-linear-to-br from-blue-100 via-purple-100 to-pink-100">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur shadow-xl">
        <CardContent className="space-y-4 p-6">

          <div className="relative">
            <Input
              placeholder="Enter your URL here"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className={error ? "border-red-500 focus-visible:ring-red-500 pr-10" : "pr-10"}
            />

            {originalUrl && (
              <button
                onClick={textClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                aria-label="Clear"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="relative">
            <Input
              placeholder="Short URL will appear here"
              value={shortUrl}
              readOnly
              onClick={() => {
                if (shortUrl) {
                  window.open(shortUrl, "_blank");
                }
              }}
              className="cursor-pointer pr-10"
            />

            {shortUrl && (
              <button
                onClick={copyUrl}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                aria-label="Copy short URL"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            )}
          </div>

          <Button
            onClick={handleShorten}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}