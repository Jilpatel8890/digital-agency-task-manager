import { useAuth } from "@clerk/clerk-react";

export const useAuthApi = () => {
  const { getToken } = useAuth();

  const fetchWithAuth = async (url) => {
    const token = await getToken();

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.json();
  };

  return { fetchWithAuth };
};
