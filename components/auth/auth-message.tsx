import { cn } from "@/lib/utils";

type AuthMessageProps = {
  status: "idle" | "success" | "error";
  message: string;
};

export function AuthMessage({ status, message }: AuthMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={cn(
        "rounded-md px-4 py-3 text-sm font-semibold leading-6",
        status === "success"
          ? "bg-lagoon-100 text-night-950"
          : "bg-red-50 text-red-700"
      )}
    >
      {message}
    </p>
  );
}

