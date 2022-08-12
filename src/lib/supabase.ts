import { createClient } from "@supabase/supabase-js";
import { config } from "process";

const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Must be specified supabase settings in env");
}
const client = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export type Manual = {
  id: number;
  title: string;
  summary: string;
  text: string;
};

export const fetchManuals = async (): Promise<Manual[]> => {
  const { data, error } = await client
    .from("manuals")
    .select("*")
    .order("title");

  if (!error && data) {
    return data;
  }

  return [];
};

export const searchManuals = async (
  keyword: string | undefined
): Promise<Manual[]> => {
  let query = client.from("manuals").select();
  if (keyword) {
    const queryKeyword = keyword
      .split(/\s+/)
      .map((word) => `'${word}' | `)
      .join("")
      .slice(0, -3);

    query = query.textSearch("summary", queryKeyword);
  }

  const { data, error } = await query;

  if (!error && data) {
    return data;
  }

  return [];
};

export const searchManualsMultipleColumns = async (
  keyword: string | undefined
): Promise<Manual[]> => {
  if (!keyword) {
    return searchManuals(keyword);
  }

  const { data, error } = await client.rpc("search_manuals", { keyword });

  if (!error && data) {
    return data;
  }

  console.log(error);

  return [];
};
