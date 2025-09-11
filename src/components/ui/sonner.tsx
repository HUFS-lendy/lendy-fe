import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "#191e24",
          "--normal-text": "#ffffff",
          "--normal-border": "none",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
