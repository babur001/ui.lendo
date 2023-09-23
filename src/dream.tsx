import React from "react";

function useQuery(...params: any[]) {
  return {} as any;
}
function Dream() {
  const { todos, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: () => {
      return request();
    },
  });

  return <></>;
}

export default Dream;
