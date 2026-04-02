/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables or Secrets panel.'
      );
    }
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

// For backward compatibility with existing imports
export const supabase = {
  get auth() { return getSupabase().auth; },
  from: (table: string) => getSupabase().from(table),
  get functions() { return getSupabase().functions; },
  get storage() { return getSupabase().storage; },
  channel: (name: string) => getSupabase().channel(name),
  rpc: (fn: string, args?: any) => getSupabase().rpc(fn, args),
} as unknown as SupabaseClient;

/**
 * SQL SCHEMA FOR SUPABASE:
 * 
 * -- 1. Profiles Table
 * create table profiles (
 *   id uuid references auth.users on delete cascade primary key,
 *   full_name text not null,
 *   role text check (role in ('admin', 'guru', 'staff')) not null default 'staff',
 *   nip text,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * -- 2. Students Table
 * create table students (
 *   id uuid default gen_random_uuid() primary key,
 *   nis text unique not null,
 *   name text not null,
 *   class_name text not null,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * -- 3. Employee Attendance Table
 * create table employee_attendance (
 *   id uuid default gen_random_uuid() primary key,
 *   user_id uuid references profiles(id) on delete cascade not null,
 *   date date not null,
 *   check_in time not null,
 *   check_out time,
 *   status text check (status in ('hadir', 'izin', 'sakit', 'alpa')) not null default 'hadir',
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   unique(user_id, date)
 * );
 * 
 * -- 4. Student Attendance Table
 * create table student_attendance (
 *   id uuid default gen_random_uuid() primary key,
 *   student_id uuid references students(id) on delete cascade not null,
 *   date date not null,
 *   status text check (status in ('hadir', 'izin', 'sakit', 'alpa')) not null default 'hadir',
 *   teacher_id uuid references profiles(id) on delete cascade not null,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   unique(student_id, date)
 * );
 * 
 * -- RLS Rules (Simplified)
 * alter table profiles enable row level security;
 * create policy "Public profiles are viewable by everyone." on profiles for select using (true);
 * create policy "Users can update own profile." on profiles for update using (auth.uid() = id);
 * 
 * -- Add more RLS as needed...
 */

export type UserRole = 'admin' | 'guru' | 'staff';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  nip?: string;
  created_at: string;
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  class_name: string;
  created_at: string;
}

export interface EmployeeAttendance {
  id: string;
  user_id: string;
  date: string;
  check_in: string;
  check_out?: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpa';
  created_at: string;
}

export interface StudentAttendance {
  id: string;
  student_id: string;
  date: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpa';
  teacher_id: string;
  created_at: string;
}
