import { unstable_noStore as noStore } from "next/cache";
import supabase from "./supabaseClient";

export const getAccounts = async () => {
  noStore();
  try {
    let { data: test, error } = await supabase.from("test").select("id");
    console.log(test);
    return test;
  } catch (error) {
    console.error(error);
  }
};
