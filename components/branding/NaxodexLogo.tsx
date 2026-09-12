import Image from "next/image";

interface NAXODEXLogoProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function NAXODEXLogo({
  className = "",
  width = 650,
  height = 263,
  priority = false,
}: NAXODEXLogoProps) {
  return (
    <Image
      src="/branding/Naxodex-logo.png"
      alt="NAXODEX"
      width={width}
      height={height}
      priority={priority}
      className={`block max-w-full object-contain${className}`}
    />
  );
}