import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export interface MLA {
  id: string;
  name: string;
  party: string;
  email: string;
  phone: string | null;
  rating: number | null;
}


export interface Organization {
  id: string;
  name: string;
  category: string;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
}


export interface Citizen {
  id: string;
  name: string;
  email: string;
  constituency: string;
  linked_MLAs: MLA[];
  linked_Organizations: Organization[];
}


interface UserResponse {
  citizen: Citizen;
}


export const fetchUserDetails = async (email: string): Promise<Citizen> => {
    
  const res = await axios.get<UserResponse>(
    `https://civiciobackend.vercel.app/api/v1/citizen/details?email=${email}`
  );
  return res.data.citizen;
};


export const useUserDetails = (email: string) => {
  return useQuery<Citizen, Error>({
    queryKey: ["user", email],
    queryFn: () => fetchUserDetails(email),
    staleTime: 1000 * 60 * 5,       
    gcTime: 1000 * 60 * 60,        
    refetchOnWindowFocus: false,
    enabled: !!email,
  });
};