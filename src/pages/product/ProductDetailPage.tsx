import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct } from '../../data/products';
import { ProductGallery } from '../../components/product/ProductGallery';
import { Button } from '../../components/ui/Button';
import { ProductRail } from '../../components/product/ProductRail';
import { products } from '../../data/products';
import { useCart } from '../../features/cart/CartContext';

export function ProductDetailPage() {
  const { slug = 'obsidian-wool-coat' } = useParams();
  const product = getProduct(slug);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2] ?? product.sizes[0]);
  const { addItem } = useCart();

  return (
    <main className="product-detail container" aria-labelledby="product-title">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/shop">Shop</Link><span aria-hidden="true">/</span><span>{product.category}</span></nav>
      <div className="product-detail__layout">
        <ProductGallery product={product} />
        <section className="product-info">
          <p className="eyebrow">{product.category}</p>
          <h1 id="product-title">{product.name}</h1>
          <p className="product-info__price">{product.price}</p>
          <p className="product-info__description">{product.description}</p>
          <fieldset className="size-selector"><legend>Size</legend><div>{product.sizes.map((size) => <button className={selectedSize === size ? 'size-option size-option--selected' : 'size-option'} key={size} type="button" aria-pressed={selectedSize === size} onClick={() => setSelectedSize(size)}>{size}</button>)}</div></fieldset>
          <Button className="product-info__cta" onClick={() => addItem(product, selectedSize)}>Add to bag</Button>
          <p className="product-info__note">Complimentary delivery and atelier packaging.</p>
        </section>
      </div>
      <ProductRail title="Complete the look" description="A considered edit to accompany this piece." products={products.filter((item) => item.slug !== product.slug)} />
    </main>
  );
}