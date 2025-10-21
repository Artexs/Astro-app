import ChangePasswordForm from "./ChangePasswordForm";
import DeleteAccountForm from "./DeleteAccountForm";

export default function AccountView() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8 max-w-2xl mx-auto">
        <ChangePasswordForm />
        <DeleteAccountForm />
      </div>
    </div>
  );
}
