import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RateLimitResult {
  allowed: boolean;
  remaining?: number;
  retryAfter?: number;
  error?: string;
}

export function useRateLimit() {
  const [isLimited, setIsLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);

  const checkRateLimit = useCallback(async (
    action: "auth" | "property" | "default",
    identifier: string
  ): Promise<RateLimitResult> => {
    try {
      const { data, error } = await supabase.functions.invoke("rate-limit", {
        body: { action, identifier },
      });

      if (error) {
        // If rate limit function fails, allow the request (fail-open for now)
        console.warn("Rate limit check failed:", error);
        return { allowed: true };
      }

      if (data.error === "Rate limit exceeded") {
        setIsLimited(true);
        setRetryAfter(data.retryAfter || 60);
        return {
          allowed: false,
          retryAfter: data.retryAfter,
          error: data.error,
        };
      }

      setIsLimited(false);
      setRetryAfter(0);
      return {
        allowed: true,
        remaining: data.remaining,
      };
    } catch (err) {
      console.warn("Rate limit check error:", err);
      // Fail-open: allow request if rate limit service is unavailable
      return { allowed: true };
    }
  }, []);

  const resetLimit = useCallback(() => {
    setIsLimited(false);
    setRetryAfter(0);
  }, []);

  return {
    checkRateLimit,
    isLimited,
    retryAfter,
    resetLimit,
  };
}
