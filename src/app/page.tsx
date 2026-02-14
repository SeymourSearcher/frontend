"use client";

import { useEffect, useState, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "";
const DISCORD_REDIRECT_URI = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI || "http://localhost:3000";

type User = { discord_id: number; username: string; avatar_hash: string | null };

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      window.history.replaceState({}, "", "/");
      handleCallback(code);
    } else {
      fetchUser();
    }
  }, []);

  async function handleCallback(code: string) {
    const res = await fetch(`${API_URL}/auth/discord/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      fetchUser();
    }
  }

  async function fetchUser() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setUser(await res.json());
    } else {
      localStorage.removeItem("token");
    }
  }

  function login() {
    const params = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      redirect_uri: DISCORD_REDIRECT_URI,
      response_type: "code",
      scope: "identify",
    });
    window.location.href = `https://discord.com/api/oauth2/authorize?${params}`;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/seymours/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      alert(`Imported ${data.imported} seymours (${data.skipped} skipped)`);
    } else {
      alert("Upload failed");
    }

    // Reset input so the same file can be selected again
    e.target.value = "";
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col gap-6">
        {user ? (
          <>
            <p className="text-zinc-400 text-center">Logged in as {user.username}</p>
            <button
              onClick={logout}
              className="px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={login}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors flex items-center gap-2"
          >
            <DiscordIcon />
            Login with Discord
          </button>
        )}

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
        >
          Upload Export
        </button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept=".txt,.json"
        />
      </div>
    </main>
  );
}

function DiscordIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}
