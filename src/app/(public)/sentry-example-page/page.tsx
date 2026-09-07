"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

export default function SentryExamplePage() {
  const [status, setStatus] = useState<string | null>(null);

  const triggerClientError = () => {
    try {
      throw new Error("Sentry Client Test Error from PetSaathi!");
    } catch (error) {
      Sentry.captureException(error);
      setStatus("Client test error captured and sent to Sentry!");
    }
  };

  const triggerBackendError = async () => {
    setStatus("Calling backend API to trigger server error...");
    try {
      const res = await fetch("/api/sentry-example-api");
      if (!res.ok) {
        setStatus("Server error triggered successfully (HTTP 500)!");
      }
    } catch (err) {
      setStatus("API request failed (Expected). Check Sentry now!");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fffdf8] p-6 text-center">
      <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-2xl font-black text-gray-900">
          Sentry Integration Test
        </h1>
        <p className="mb-6 text-sm text-gray-600">
          Click any of the buttons below to trigger test errors to verify your Sentry dashboard.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={triggerBackendError}
            className="w-full rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 shadow-md"
          >
            ⚡ Trigger Server / API Error (Recommended)
          </button>

          <button
            onClick={triggerClientError}
            className="w-full rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700 shadow-md"
          >
            🔥 Trigger Client Error
          </button>
        </div>

        {status && (
          <div className="mt-6 rounded-lg bg-green-50 p-4 border border-green-200">
            <p className="text-sm font-medium text-green-800">
              ✅ {status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
