"use client";

import { useEffect  , Suspense} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { useAuthContext } from "@/context/AppContext";

const Success = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const {login} = useAuthContext()

  useEffect(() => {
    if (token) {
      Cookies.set("token", token, { expires: 1 });

      try {

        const decoded: {id:string , name:string} = jwtDecode(token);
        const { id, name } = decoded; 
        login(token, name, String(id));
        router.push("/");

      } catch (error) {
        console.error("Error decoding JWT:", error);
        router.push("/login"); 
      }
    } else {
      router.push("/login");
    }
  }, [token, router]);

  return <p>Redirecting...</p>;
};

const SuccessComponent = () => (
    <Suspense fallback={<p>Loading...</p>}>
      <Success />
    </Suspense>
  );

export default SuccessComponent;
