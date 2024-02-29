import { cn } from "~/lib/utils";

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export const Image = ({ src, alt, className }: ImageProps) => {
  return (
    <figure className={cn("h-12 w-12", className)}>
      <img src={src} alt={alt} className="block w-full h-full object-contain" />
    </figure>
  );
};
