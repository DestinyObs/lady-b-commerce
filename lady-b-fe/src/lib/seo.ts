interface SeoMeta {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: string;
  noIndex?: boolean;
}

const BASE_TITLE = 'Lady B Designs and Handcraft';
const BASE_DESCRIPTION =
  'Handcrafted luxury bead bags, statement necklaces, and bespoke accessories. Wearable Art, Crafted by Hand.';

export const SEO_PAGES: Record<string, SeoMeta> = {
  home: {
    title: `${BASE_TITLE} | Luxury Artisan Fashion`,
    description: `${BASE_DESCRIPTION} Global shipping. Custom orders available.`,
    keywords: 'luxury bead bags, handmade beaded handbags, artisan accessories, custom bead bags, statement necklaces',
  },
  shop: {
    title: `Shop Luxury Handcrafted Accessories | ${BASE_TITLE}`,
    description: 'Browse our collection of luxury handcrafted bead bags, statement necklaces, and bespoke accessories.',
    keywords: 'shop luxury handmade bags, beaded handbags, artisan jewelry, handcrafted accessories',
  },
  collections: {
    title: `Collections | ${BASE_TITLE}`,
    description: 'Explore Lady B\'s curated collections of luxury handcrafted accessories.',
  },
  customOrders: {
    title: `Bespoke Custom Orders | ${BASE_TITLE}`,
    description: 'Commission a one-of-a-kind handcrafted piece. Custom bead bags, necklaces, and accessories made to your vision.',
    keywords: 'custom bead bag, bespoke handmade bag, custom beaded accessories, made to order luxury',
  },
  about: {
    title: `Our Story | ${BASE_TITLE}`,
    description: 'The story behind Lady B Designs — a luxury artisan fashion house rooted in patience, skill, and creative expression.',
  },
  craftsmanship: {
    title: `Craftsmanship | ${BASE_TITLE}`,
    description: 'Every piece is made by hand, bead by bead. Discover the craftsmanship behind Lady B Designs.',
  },
  contact: {
    title: `Contact | ${BASE_TITLE}`,
    description: 'Get in touch with Lady B Designs. Custom orders, wholesale inquiries, press, and general questions welcome.',
  },
  journal: {
    title: `Journal | ${BASE_TITLE}`,
    description: 'Style guides, collection stories, craftsmanship insights, and behind-the-brand content.',
  },
  wholesale: {
    title: `Wholesale | ${BASE_TITLE}`,
    description: 'Wholesale and stockist inquiries for Lady B Designs luxury handcrafted accessories.',
  },
  press: {
    title: `Press | ${BASE_TITLE}`,
    description: 'Press, editorial, and media inquiries for Lady B Designs and Handcraft.',
  },
};

export function productSeo(product: { name: string; description?: string | null; seoTitle?: string | null; seoDescription?: string | null; images?: Array<{ url: string }> }): SeoMeta {
  return {
    title: product.seoTitle || `${product.name} | ${BASE_TITLE}`,
    description: product.seoDescription || product.description?.slice(0, 160) || BASE_DESCRIPTION,
    image: product.images?.[0]?.url,
    type: 'product',
  };
}

export function setPageTitle(title: string): void {
  document.title = title;
}
