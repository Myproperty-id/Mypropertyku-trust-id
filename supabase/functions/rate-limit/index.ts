import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  'auth': { maxRequests: 5, windowMs: 60000 },      // 5 auth attempts per minute
  'property': { maxRequests: 10, windowMs: 60000 }, // 10 property submissions per minute
  'default': { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute default
}

// In-memory rate limit store (per instance)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, type: string): { allowed: boolean; remaining: number; resetTime: number } {
  const config = RATE_LIMITS[type] || RATE_LIMITS['default'];
  const key = `${type}:${identifier}`;
  const now = Date.now();
  
  let record = rateLimitStore.get(key);
  
  if (!record || now >= record.resetTime) {
    record = { count: 0, resetTime: now + config.windowMs };
    rateLimitStore.set(key, record);
  }
  
  record.count++;
  
  const allowed = record.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - record.count);
  
  return { allowed, remaining, resetTime: record.resetTime };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, identifier } = await req.json();
    
    if (!action || !identifier) {
      return new Response(
        JSON.stringify({ error: 'Missing action or identifier' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get client IP from headers (fallback to identifier)
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     identifier;
    
    const rateLimitKey = `${clientIP}:${identifier}`;
    const result = checkRateLimit(rateLimitKey, action);
    
    if (!result.allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(result.resetTime),
            'Retry-After': String(Math.ceil((result.resetTime - Date.now()) / 1000))
          } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        allowed: true,
        remaining: result.remaining,
        resetTime: result.resetTime
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': String(result.remaining),
          'X-RateLimit-Reset': String(result.resetTime)
        } 
      }
    );
    
  } catch (error) {
    console.error('Rate limit error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
