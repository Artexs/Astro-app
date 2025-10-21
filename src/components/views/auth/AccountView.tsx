import { useState, useEffect } from "react"; // Import useState and useEffect
import ChangePasswordForm from "./ChangePasswordForm";
import DeleteAccountForm from "./DeleteAccountForm";
import { supabaseClient } from "@/db/supabase.client"; // Import supabaseClient

export default function AccountView() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabaseClient.auth.getSession();
      if (data?.session?.user) {
        setUserEmail(data.session.user.email);
      } else if (error) {
        console.error("Error fetching user session:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8 max-w-2xl mx-auto">
        {userEmail && (
          <div className="text-center text-lg font-semibold">
            Logged in as: {userEmail}
          </div>
        )}
        <ChangePasswordForm />
        <DeleteAccountForm />
      </div>
    </div>
  );
}
