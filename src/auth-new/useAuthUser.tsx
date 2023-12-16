import { req } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";

function useAuthUser() {
  const queryAuthUser = useQuery({
    queryKey: ["queryAuthUser"],
    queryFn: () => {
      return req({
        method: "GET",
        url: "/auth/auth-info",
      });
    },
  });

  return queryAuthUser;
}

export default useAuthUser;
