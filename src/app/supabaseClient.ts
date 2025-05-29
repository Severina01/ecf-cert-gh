// src/app/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// 👇 Usa tu URL y KEY del proyecto de Supabase (te salen en Settings > API)
const supabaseUrl = 'https://mruomgdwtutfwqxffgaj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ydW9tZ2R3dHV0ZndxeGZmZ2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NDEzNjgsImV4cCI6MjA2MTIxNzM2OH0.M7Hbonty-7404r4ellBSxIu85aW1wG5CPeN0MjV6SLY';
export const supabase = createClient(supabaseUrl, supabaseKey);
