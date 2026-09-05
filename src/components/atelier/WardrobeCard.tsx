import { Heart } from 'lucide-react';
import { useState } from 'react';
import { RemoteImage } from '../ui/RemoteImage';

interface WardrobeCardProps {
  name: string;
  category: string;
  imageId: string;
}

export function WardrobeCard({ name, category, imageId }: WardrobeCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="wardrobe-card">
      <div className="wardrobe-card__image-frame">
        <div className="wardrobe-card__image">
          <RemoteImage assetId={imageId} />
        </div>
        <button
          className={`wardrobe-card__save-btn ${saved ? 'wardrobe-card__save-btn--active' : ''}`}
          type="button"
          onClick={() => setSaved(!saved)}
          aria-label={saved ? `Remove ${name} from saved` : `Save ${name}`}
        >
          <Heart size={16} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
      </div>
      <div className="wardrobe-card__meta">
        <h3 className="wardrobe-card__name">{name}</h3>
        <p className="wardrobe-card__category">{category}</p>
      </div>
    </article>
  );
}