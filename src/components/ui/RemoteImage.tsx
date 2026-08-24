import { getAsset } from '../../assets/manifest';

type RemoteImageProps = {
  assetId: string;
  alt?: string;
  className?: string;
};

export function RemoteImage({ assetId, alt, className = '' }: RemoteImageProps) {
  const asset = getAsset(assetId);
  if (!asset?.sourceUrl) return <div className={`image-fallback ${className}`.trim()} role="img" aria-label={alt ?? asset?.alt} />;
  return <img className={className} src={asset.sourceUrl} alt={alt ?? asset.alt} onError={(event) => { event.currentTarget.style.display = 'none'; }} />;
}