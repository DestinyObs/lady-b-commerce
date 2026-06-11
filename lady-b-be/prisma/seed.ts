import { PrismaClient, UserRole, ProductStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Lady B Designs database...');

  // Super Admin
  const adminPassword = await bcrypt.hash('AdminLadyB2024!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'Adebiyiblessing55@gmail.com' },
    update: {},
    create: {
      email: 'Adebiyiblessing55@gmail.com',
      passwordHash: adminPassword,
      firstName: 'Lady B',
      lastName: 'Designs',
      role: UserRole.SUPER_ADMIN,
      isEmailVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Demo customer account
  const customerPassword = await bcrypt.hash('LadyBGuest2024!', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'demo@ladybdesigns.com' },
    update: {},
    create: {
      email: 'demo@ladybdesigns.com',
      passwordHash: customerPassword,
      firstName: 'Grace',
      lastName: 'Adeyemi',
      role: UserRole.CUSTOMER,
      isEmailVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Demo customer created:', customer.email);

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'bead-bags' }, update: {}, create: { name: 'Bead Bags', slug: 'bead-bags', description: 'Handcrafted luxury bead bags', sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: 'necklaces' }, update: {}, create: { name: 'Necklaces', slug: 'necklaces', description: 'Statement beaded necklaces', sortOrder: 2 } }),
    prisma.category.upsert({ where: { slug: 'accessories' }, update: {}, create: { name: 'Accessories', slug: 'accessories', description: 'Bespoke fashion accessories', sortOrder: 3 } }),
    prisma.category.upsert({ where: { slug: 'custom-pieces' }, update: {}, create: { name: 'Custom Pieces', slug: 'custom-pieces', description: 'Made-to-order bespoke pieces', sortOrder: 4 } }),
  ]);
  console.log('✅ Categories created');

  // Collections
  const collections = await Promise.all([
    prisma.collection.upsert({
      where: { slug: 'signature-collection' },
      update: {},
      create: {
        name: 'Signature Collection',
        slug: 'signature-collection',
        description: 'The foundational Lady B collection — timeless beadwork elevated for the modern woman.',
        isFeatured: true,
        isActive: true,
        sortOrder: 1,
      },
    }),
    prisma.collection.upsert({
      where: { slug: 'statement-pieces' },
      update: {},
      create: {
        name: 'Statement Pieces',
        slug: 'statement-pieces',
        description: 'Bold, architectural beadwork for women who command attention.',
        isFeatured: true,
        isActive: true,
        sortOrder: 2,
      },
    }),
    prisma.collection.upsert({
      where: { slug: 'evening-edit' },
      update: {},
      create: {
        name: 'Evening Edit',
        slug: 'evening-edit',
        description: 'Handcrafted pieces designed for unforgettable evenings.',
        isFeatured: false,
        isActive: true,
        sortOrder: 3,
      },
    }),
  ]);
  console.log('✅ Collections created');

  // Sample Products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'ivory-arch-bead-bag' },
      update: {},
      create: {
        name: 'Ivory Arch Bead Bag',
        slug: 'ivory-arch-bead-bag',
        description: 'An architectural masterpiece in hand-strung ivory and pearl beads. Each bag takes over 40 hours to complete.',
        story: 'Inspired by the grand arches of colonial architecture, this bag pairs structural design with the delicate art of beadwork.',
        materials: 'Japanese seed beads, pearl beads, brass frame, satin lining',
        dimensions: '22cm x 14cm x 6cm',
        careInstructions: 'Store in dust bag. Avoid moisture. Handle with care.',
        craftDetails: 'Each bead is individually threaded onto a custom-formed brass frame using a traditional hand-stringing technique refined over 15 years.',
        price: 485.00,
        compareAtPrice: 540.00,
        status: ProductStatus.ACTIVE,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        categoryId: categories[0].id,
        publishedAt: new Date(),
        seoTitle: 'Ivory Arch Bead Bag — Luxury Handcrafted | Lady B Designs',
        seoDescription: 'Handcrafted ivory bead bag with pearl accents. Each piece takes 40+ hours to make. Free global shipping.',
      },
    }),
    prisma.product.upsert({
      where: { slug: 'emerald-cascade-necklace' },
      update: {},
      create: {
        name: 'Emerald Cascade Necklace',
        slug: 'emerald-cascade-necklace',
        description: 'A waterfall of emerald and champagne gold beads, hand-layered to create movement with every step.',
        story: 'The Cascade series was born from a desire to capture the living quality of water in wearable form.',
        materials: 'Czech glass beads, 18K gold-plated findings, silk thread',
        dimensions: 'Length: 48cm adjustable',
        careInstructions: 'Store flat. Avoid perfume contact. Clean with soft cloth.',
        price: 285.00,
        status: ProductStatus.ACTIVE,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        categoryId: categories[1].id,
        publishedAt: new Date(),
        seoTitle: 'Emerald Cascade Necklace — Statement Beaded Jewelry | Lady B',
        seoDescription: 'Hand-layered emerald beaded necklace with gold accents. Luxury artisan jewelry made in Indianapolis.',
      },
    }),
    prisma.product.upsert({
      where: { slug: 'bespoke-bead-bag-custom' },
      update: {},
      create: {
        name: 'Bespoke Bead Bag — Made to Order',
        slug: 'bespoke-bead-bag-custom',
        description: 'Your vision, handcrafted. Tell us your colors, your occasion, your story — we will create something that cannot be found anywhere else.',
        price: 600.00,
        status: ProductStatus.ACTIVE,
        isFeatured: false,
        isMadeToOrder: true,
        isCustomizable: true,
        madeToOrderLeadDays: 21,
        categoryId: categories[3].id,
        publishedAt: new Date(),
      },
    }),
  ]);
  console.log('✅ Sample products created');

  // Site Settings
  const siteSettings = [
    { key: 'store_name', value: 'Lady B Designs and Handcraft', group: 'general' },
    { key: 'store_email', value: 'Adebiyiblessing55@gmail.com', group: 'general' },
    { key: 'store_phone', value: '+1 (317) 333-1333', group: 'general' },
    { key: 'store_address', value: '731 Westbury West Dr, Indianapolis, IN 46224, USA', group: 'general' },
    { key: 'store_tagline', value: 'Wearable Art, Crafted by Hand', group: 'general' },
    { key: 'free_shipping_threshold', value: '250', group: 'shipping' },
    { key: 'default_currency', value: 'USD', group: 'payments' },
    { key: 'announcement_bar_text', value: 'Complimentary global shipping on orders over $250 | Custom orders available', group: 'marketing', isPublic: true },
    { key: 'maintenance_mode', value: 'false', group: 'general' },
  ];

  await Promise.all(
    siteSettings.map(({ key, value, group, isPublic }) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value, group, isPublic: isPublic ?? false },
      }),
    ),
  );
  console.log('✅ Site settings created');

  // FAQs
  const faqData = [
    { question: 'How do I place an order?', answer: "Browse our collections, select your piece, choose any available options, and add to your bag. Checkout accepts credit/debit cards. You'll receive an order confirmation email immediately.", category: 'Orders & Shopping', sortOrder: 0 },
    { question: 'Can I modify or cancel my order?', answer: "Orders can be modified or cancelled within 24 hours of placement. After that, we may have already begun preparation. Please contact us at Adebiyiblessing55@gmail.com or +1 (317) 507-4966 as soon as possible.", category: 'Orders & Shopping', sortOrder: 1 },
    { question: 'Do you offer gift packaging?', answer: "All Lady B pieces arrive in our signature keepsake box with a dust bag and tissue — this is our standard packaging. We can add a handwritten gift note at no additional charge.", category: 'Orders & Shopping', sortOrder: 2 },
    { question: 'How long does shipping take?', answer: "Ready-to-ship pieces are dispatched within 3–5 business days. US domestic shipping takes 3–7 business days. International orders typically arrive in 7–14 business days, depending on destination.", category: 'Shipping & Delivery', sortOrder: 0 },
    { question: 'Do you offer free shipping?', answer: "Yes — we offer complimentary standard shipping on all US orders over $250. International orders qualify for free shipping on purchases over $400.", category: 'Shipping & Delivery', sortOrder: 1 },
    { question: 'Do you ship internationally?', answer: "We ship worldwide. International shipping rates and times vary by destination. All international orders are dispatched via tracked courier. Import duties and taxes are the responsibility of the recipient.", category: 'Shipping & Delivery', sortOrder: 2 },
    { question: 'Can I track my order?', answer: "Yes. Once your order is dispatched, you'll receive a tracking number by email. You can also track your order through your account dashboard.", category: 'Shipping & Delivery', sortOrder: 3 },
    { question: 'What is your returns policy?', answer: "We accept returns on standard (non-bespoke) items within 7 days of delivery, provided they are unused and in original condition. Please contact us to initiate a return.", category: 'Returns & Refunds', sortOrder: 0 },
    { question: 'Can I return a bespoke piece?', answer: "Bespoke and custom-made pieces cannot be returned, as they are made specifically for you. However, if there is a fault or defect, we will remake or repair the piece at no charge.", category: 'Returns & Refunds', sortOrder: 1 },
    { question: 'How long do refunds take?', answer: "Refunds are processed within 5–7 business days of receiving the returned item. You'll receive an email confirmation once your refund has been issued.", category: 'Returns & Refunds', sortOrder: 2 },
    { question: 'How do I start a bespoke commission?', answer: "Contact us through the bespoke page or send us a message describing your vision, timeline, and budget. We'll arrange a consultation to discuss your commission in detail.", category: 'Bespoke & Custom Orders', sortOrder: 0 },
    { question: 'How long does a custom piece take?', answer: "Most commissions take 3–6 weeks from design approval to delivery. We'll confirm your exact timeline during the consultation. Rush commissions may be possible — please enquire.", category: 'Bespoke & Custom Orders', sortOrder: 1 },
    { question: 'What is the minimum spend for a custom order?', answer: "Our minimum commission is $120 for necklaces and $280 for bags. Pricing depends on complexity, materials, and size. A full quote is provided after consultation.", category: 'Bespoke & Custom Orders', sortOrder: 2 },
    { question: 'How do I care for my beaded piece?', answer: "Store in the provided dust bag away from direct sunlight and moisture. Clean gently with a dry, soft cloth. Avoid contact with perfume, water, and chemicals. With proper care, your piece will last a lifetime.", category: 'Product Care', sortOrder: 0 },
    { question: 'Can a piece be repaired if damaged?', answer: "Yes. We offer repair services for Lady B pieces. Contact us with photos of the damage and we'll assess the repair. Charges vary based on the extent of work required.", category: 'Product Care', sortOrder: 1 },
  ];
  for (const faq of faqData) {
    await prisma.faq.upsert({ where: { id: `faq-${faq.question.slice(0, 20).replace(/\s/g, '-').toLowerCase()}` }, update: {}, create: { ...faq, id: `faq-${faq.question.slice(0, 20).replace(/\s/g, '-').toLowerCase()}` } });
  }
  console.log(`✅ ${faqData.length} FAQs seeded`);

  // Journal Posts
  const journalPosts = [
    {
      slug: 'art-of-beading',
      title: 'The Ancient Art of Beading',
      excerpt: 'From Egyptian pharaohs to Yoruba royalty — exploring 6,000 years of beadwork as cultural language, status symbol, and spiritual practice.',
      body: `Beadwork is one of humanity's oldest art forms. Archaeological evidence traces its origins back more than 75,000 years to a cave in South Africa, where tiny shell beads were found with holes deliberately pierced through them — suggesting they were worn or strung long before language was codified.

In ancient Egypt, faience beads in turquoise and blue adorned pharaohs and commoners alike, believed to carry protective power. In West Africa — particularly among the Yoruba and Akan people — beads became a language unto themselves. Every colour, every combination, every knot carried meaning. Royal families wore coral beads to signal divine connection to Olokun, the sea deity. Warriors wore black beads. Healers wore white.

At Lady B, every piece we create draws from this deep well of meaning. The beads we source, the colours we choose, the patterns we weave — all carry intention. When you wear a Lady B piece, you are wearing something that connects you to thousands of years of human creativity and expression.`,
      coverImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=85&auto=format&fit=crop',
      category: 'Craft',
      tags: ['heritage', 'beading', 'history', 'craft'],
      readTimeMinutes: 6,
      status: 'PUBLISHED',
      authorName: 'Lady B',
      authorRole: 'Designer & Founder',
      publishedAt: new Date('2026-05-10'),
    },
    {
      slug: 'caring-for-beaded-bags',
      title: 'How to Care For Your Beaded Bag',
      excerpt: 'A beaded bag is an investment. With the right care, it will outlast trends, seasons, and decades. Here is everything you need to know.',
      body: `A Lady B bag is not fast fashion. It is a slow, considered, handcrafted object — one that demands and rewards a different kind of care.

**Storage**
Always store your bag in the dust bag provided. Keep it away from direct sunlight, which can fade the beads over time, and away from moisture. Do not hang it by its strap for long periods — lay it flat or stuff it gently to maintain its shape.

**Cleaning**
Wipe gently with a dry, soft cloth. Never use water, cleaning sprays, or chemical solvents. If a bead becomes soiled, a barely-damp cotton bud applied precisely to the affected bead is the safest option.

**Wear**
Avoid direct contact with perfume, hairspray, and body oils — apply these before dressing. Be mindful of rough surfaces that can snag or dislodge individual beads.

**If a bead falls off**
Keep it. Beads can be reattached by a skilled hand. If you bring your piece back to us within the first two years, we will repair it free of charge.`,
      coverImage: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=1200&q=85&auto=format&fit=crop',
      category: 'Care Guide',
      tags: ['care', 'bags', 'maintenance'],
      readTimeMinutes: 4,
      status: 'PUBLISHED',
      authorName: 'Lady B',
      authorRole: 'Designer & Founder',
      publishedAt: new Date('2026-04-22'),
    },
    {
      slug: 'colour-meaning-west-africa',
      title: 'The Language of Colour in West African Beadwork',
      excerpt: 'Every colour in traditional Yoruba and Ghanaian beadwork carries deep meaning. Red for courage, white for purity, gold for royalty.',
      body: `In many West African traditions, colour is not decoration — it is communication. Beads are chosen not just for their beauty but for what they say.

Among the Yoruba people of Nigeria, colour in beadwork follows centuries-old codes. Red speaks of courage, authority, and the fire of Shango, the deity of thunder. White is the colour of Obatala, the deity of purity, calmness, and wisdom. Blue honours Yemoja, the mother of waters. Gold — or yellow — signals wealth, royalty, and divine favour.

In Ghanaian kente and beadwork traditions, the symbolism runs equally deep. Black beads speak of maturity and spiritual connection. Green evokes growth, fertility, and the renewal of the land. White marks peaceful intention.

At Lady B, we draw consciously on this colour vocabulary. When we place a deep terracotta bead beside ivory, we are not simply composing a palette — we are placing courage beside purity. When we thread gold beads into a necklace design, we are asking the piece to carry something beyond fashion.`,
      coverImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&q=85&auto=format&fit=crop',
      category: 'Heritage',
      tags: ['colour', 'heritage', 'west africa', 'yoruba', 'symbolism'],
      readTimeMinutes: 5,
      status: 'PUBLISHED',
      authorName: 'Lady B',
      authorRole: 'Designer & Founder',
      publishedAt: new Date('2026-03-18'),
    },
    {
      slug: 'bespoke-process',
      title: 'Inside a Lady B Bespoke Commission',
      excerpt: 'From first conversation to final piece — we document the full journey of a bespoke wedding bag, created for a client in London.',
      body: `Every bespoke commission begins with a conversation. Not a form, not a brief — a real exchange about who you are, what you love, and what you want this piece to mean.

In early February, we received a message from Adaeze in London. She was getting married in September and wanted a bag that would hold her something blue, something gold, and something that felt like home — like Nigeria, like her grandmother's jewellery box, like Sunday mornings with aunties who wore beads as naturally as they wore their faith.

**The consultation**
We spent an hour on a video call. Adaeze showed us photographs of her dress, her grandmother's old necklaces, the colour palette of her venue. She wanted navy, gold, and ivory. She wanted texture. She wanted something that would survive the first dance and last as an heirloom.

**The design process**
We sketched three distinct directions. Adaeze chose the most intricate — a structured minaudière in navy seed beads with gold accent rows and an ivory trim. We sourced glass seed beads from Prague, metal-coated beads from Japan, and freshwater pearls for the clasp detail.

**The making**
Seven weeks. Fourteen hours of beading. One bag.

When Adaeze received it, she sent us a single message: "This is exactly what I imagined, and nothing like what I imagined."

That is the bespoke promise.`,
      coverImage: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1200&q=85&auto=format&fit=crop',
      category: 'Behind the Scenes',
      tags: ['bespoke', 'process', 'wedding', 'commission'],
      readTimeMinutes: 8,
      status: 'PUBLISHED',
      authorName: 'Lady B',
      authorRole: 'Designer & Founder',
      publishedAt: new Date('2026-02-14'),
    },
    {
      slug: 'styling-beaded-necklaces',
      title: 'Three Ways to Style a Statement Necklace',
      excerpt: 'Bold beaded necklaces deserve to be the centre of attention. Here are three looks — from editorial minimalism to full maximalist.',
      body: `A statement necklace makes a demand: let me be seen.

The question is not whether to wear it — the question is how to let it breathe.

**Look 1: The Clean Slate**
A crew-neck white tee, well-cut trousers, and nothing else. No earrings. No rings. The necklace sits against the white like a painting on a gallery wall. This is the editorial approach — confident, spare, deliberate. It says: I know what I am doing.

**Look 2: The Tonal Study**
Match your necklace to one element of your outfit. If your beads are terracotta and gold, wear them over a burnt-orange silk shirt. The harmony creates depth without competition. Add small gold earrings — nothing that rivals the necklace, only echoes it.

**Look 3: The Full Devotion**
Stack intentionally. Wear the statement piece with two or three finer chains of varying lengths. Let the layers create conversation. This approach requires confidence, but when it works — and it does work — it is the closest thing fashion has to music. Multiple voices, one composition.

The rule that underpins all three: the necklace leads. Everything else follows.`,
      coverImage: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1200&q=85&auto=format&fit=crop',
      category: 'Style',
      tags: ['styling', 'necklaces', 'how-to', 'fashion'],
      readTimeMinutes: 3,
      status: 'PUBLISHED',
      authorName: 'Lady B',
      authorRole: 'Designer & Founder',
      publishedAt: new Date('2026-01-28'),
    },
  ];
  for (const post of journalPosts) {
    await prisma.journalPost.upsert({ where: { slug: post.slug }, update: {}, create: post });
  }
  console.log(`✅ ${journalPosts.length} journal posts seeded`);

  console.log('\n🎉 Database seeded successfully!');
  console.log(`   Admin: Adebiyiblessing55@gmail.com / AdminLadyB2024!`);
  console.log(`   Products: ${products.length} sample products`);
  console.log(`   Collections: ${collections.length} collections`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
