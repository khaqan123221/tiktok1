import { useCallback, useEffect, useState } from "react";
import { SupbaseContext } from "./useSupabase";

import supabase from "../lib/supabase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import axios from "axios";

export const SupbaseProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reels, setReels] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      const response = await axios.get("https://tiktokbackend-dqctajb3efg0ance.eastus-01.azurewebsites.net/getVideos")
      setReels(response.data);
      console.log(reels)

      setIsLoading(false);
    })();
  }, [setReels]);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.dismiss();
      toast.error(error.message);
    } else {
      setSession(data.session);
    }

    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.dismiss();
      toast.error(error.message);
    } else {
      setSession(null);
      navigate("/");
    }
  }, []);

  const signUp = useCallback(async (email, password, name) => {
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      data: { name },
    });

    if (error) {
      toast.dismiss();
      toast.error(error.message);
    } else {
      setSession(data.session);
    }

    setIsLoading(false);
  }, []);

  const upload = useCallback(
    async (file) => {
      setIsLoading(true);
      toast.dismiss();

      const { data, error } = await supabase.storage
        .from("tiktok")
        .upload(`/uploads/${file.name}`, file);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Video uploaded successfully");
        setReels([...reels, { ...data, name: file.name }]);
      }

      setIsLoading(false);
    },
    [reels]
  );

  return (
    <SupbaseContext.Provider
      value={{ session, isLoading, login, logout, signUp, reels, upload }}
    >
      {children}
    </SupbaseContext.Provider>
  );
};
