"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { createClient } from "@/utils/supabase/client";

type Props = {
  id?: string;
};

export const AuthInitializer = ({ id }: Props) => {
  const setUser = useAuthStore((s) => s.setUser);
  const supabase = createClient();

  useEffect(() => {
    const fetchRole = async () => {
      // get profile based on supabase user id
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (data && !error) {
        setUser(data);
      }
    };

    fetchRole();
  }, []);

  return null;
};
