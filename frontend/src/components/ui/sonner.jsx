import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = (props) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      style={{
        "--toast-bg": "oklch(var(--background))",
        "--toast-text": "oklch(var(--foreground))",
        "--toast-border": "oklch(var(--border))",
        "--success-bg": "oklch(var(--primary))",
        "--error-bg": "oklch(var(--destructive))",
      }}
      toastOptions={{
        className:
          "bg-[--toast-bg] text-[--toast-text] border border-[--toast-border] shadow-md rounded-md",
      }}
      {...props}
    />
  );
};

export { Toaster };
