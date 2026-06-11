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

  console.log('\n🎉 Database seeded successfully!');
  console.log(`   Admin: Adebiyiblessing55@gmail.com / AdminLadyB2024!`);
  console.log(`   Products: ${products.length} sample products`);
  console.log(`   Collections: ${collections.length} collections`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
