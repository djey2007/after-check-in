import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="secondary">
        <LogOut className="h-4 w-4" />
        Deconnexion
      </Button>
    </form>
  );
}

