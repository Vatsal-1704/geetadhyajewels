import { Link } from "react-router-dom";
import { placeholderImages } from "../../utils/placeholderImages";
import "./ShopByCategory.css";

const categories = [
  { name: "Necklaces", slug: "necklaces", img: placeholderImages.category.necklaces },
  { name: "Earrings", slug: "earrings", img: placeholderImages.category.earrings },
  { name: "Bangles", slug: "bangles", img: placeholderImages.category.bangles },
  { name: "Rings", slug: "rings", img: placeholderImages.category.rings },
  { name: "Anklets", slug: "anklets", img: placeholderImages.category.anklets },
  { name: "Bridal Sets", slug: "bridal-sets", img: placeholderImages.category.bridal },
  { name: "Hair Jewellery", slug: "hair-jewellery", img: placeholderImages.category.necklaces },
  { name: "Bracelets", slug: "bracelets", img: placeholderImages.category.bangles },
];

export default function ShopByCategory() {
  return (
    <section className="sbc">
      <div className="sbc__track">
        {categories.map((cat) => (
          <Link key={cat.slug} to={`/collections/${cat.slug}`} className="sbc__item">
            <div className="sbc__circle">
              <img
                src={cat.img}
                alt={cat.name}
                className="sbc__img"
                loading="lazy"
              />
            </div>
            <span className="sbc__name">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
