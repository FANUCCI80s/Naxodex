import Image from "next/image";

interface NAXODEXLogoProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function NAXODEXLogo({
  className = "",
  width = 180,
  height = 52,
  priority = false,
}: NAXODEXLogoProps) {
  return (
    <Image
      src="/branding/Naxodex-logo.png"
      alt="NAXODEX"
      width={width}
      height={height}
      priority={priority}
      className={`block h-auto w-auto max-w-full object-contain ${className}`}
    />
  );
}