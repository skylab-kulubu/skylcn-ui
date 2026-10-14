import { cn } from '../lib/cn.js';

const RATIO = {
  video: 'aspect-video',
  square: 'aspect-square',
  wide: 'aspect-[21/9]',
  portrait: 'aspect-[3/4]',
} as const;

export type CoverImageProps = {
  src: string;
  /** What the image shows; empty when the title beside it already says it. */
  alt: string;
  /** The frame's shape; 16:9 by default. */
  ratio?: keyof typeof RATIO;
  /** `eager` for the image above the fold, such as an event header's cover. */
  loading?: 'lazy' | 'eager';
  className?: string;
};

/**
 * An event poster or cover in a fixed frame, never cropped: the whole image sits in the
 * middle and a blurred copy of it fills the rest, so a square or tall poster in a 16:9
 * frame reads as one picture instead of a grey band. No inline style, so it runs under a
 * strict Content-Security-Policy.
 */
export function CoverImage({
  src,
  alt,
  ratio = 'video',
  loading = 'lazy',
  className,
}: CoverImageProps) {
  return (
    <span
      data-slot="cover-image"
      className={cn(
        'relative block w-full overflow-hidden rounded-lg bg-muted',
        RATIO[ratio],
        className,
      )}
    >
      <img
        src={src}
        alt=""
        aria-hidden
        loading={loading}
        decoding="async"
        className="absolute inset-0 size-full scale-110 object-cover opacity-60 blur-xl saturate-150"
      />
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        className="relative size-full object-contain"
      />
    </span>
  );
}
