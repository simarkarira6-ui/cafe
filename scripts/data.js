/**
 * Scoop & Sizzle - Centralized Store & Menu Configuration
 * Owner can easily edit store details, currency, hours, and menu items here.
 */

export const STORE_CONFIG = {
  name: "Scoop & Sizzle",
  shortName: "Scoop & Sizzle",
  tagline: "Scoops of Happiness. Bites of Heaven.",
  description: "Artisanal handcrafted ice cream, velvet thickshakes, warm Belgian waffle sundaes, and gourmet sizzling hot burgers & bites.",
  
  // Ordering Configuration
  whatsappNumber: "+15557266779", // Clean digits for wa.me link (e.g. 15557266779)
  whatsappNumberFormatted: "+1 (555) 726-6779",
  phone: "+1 (555) 726-6779",
  email: "hello@scoopandsizzle.cafe",
  
  // Currency settings
  currencySymbol: "$",
  currencyCode: "USD",
  
  // Location & Hours (Clearly indicated sample info ready for business owner update)
  address: "142 Artisan Boulevard, Sweet Valley, CA 90210",
  googleMapsUrl: "https://maps.google.com/?q=Sweet+Valley+Artisan+Boulevard",
  hours: [
    { days: "Monday – Thursday", time: "11:00 AM – 10:00 PM" },
    { days: "Friday – Saturday", time: "11:00 AM – 11:30 PM" },
    { days: "Sunday", time: "12:00 PM – 10:00 PM" }
  ],
  
  // Announcement Bar
  announcement: {
    active: true,
    badge: "🔥 CHEF'S SPECIAL",
    text: "Get a free Scoop with any Gourmet Smash Combo this week! Order via WhatsApp.",
    actionText: "View Offers",
    actionLink: "#offers"
  },
  
  socials: {
    instagram: "https://instagram.com/scoopandsizzle",
    facebook: "https://facebook.com/scoopandsizzle",
    tiktok: "https://tiktok.com/@scoopandsizzle"
  }
};

export const CATEGORIES = [
  {
    id: "ice-cream",
    title: "Handcrafted Ice Cream",
    shortTitle: "Ice Cream",
    count: "12 Flavors",
    description: "Slow-churned daily with fresh cream & organic pure extracts.",
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80",
    badge: "Popular"
  },
  {
    id: "shakes",
    title: "Velvet Thick Shakes",
    shortTitle: "Thick Shakes",
    count: "8 Varieties",
    description: "Ultra-thick, triple-blended with whole milk and real toppings.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    badge: "Indulgent"
  },
  {
    id: "sundaes-waffles",
    title: "Sundaes & Waffles",
    shortTitle: "Sundaes & Waffles",
    count: "7 Treats",
    description: "Freshly pressed golden Belgian waffles topped with warm fudge & gelato.",
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80",
    badge: "Warm & Cold"
  },
  {
    id: "burgers",
    title: "Burgers & Sandwiches",
    shortTitle: "Burgers & Sandwiches",
    count: "6 Burgers",
    description: "Sizzling smashed Angus beef and buttermilk fried chicken on toasted brioche.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    badge: "Sizzling Hot"
  },
  {
    id: "hot-snacks",
    title: "Fries & Hot Snacks",
    shortTitle: "Fries & Hot Snacks",
    count: "6 Sides",
    description: "Golden seasoned loaded fries, melted cheese sticks, and crispy tenders.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    badge: "Crispy Crunch"
  }
];

export const MENU_ITEMS = [
  // --- ICE CREAM ---
  {
    id: "ic-1",
    name: "Wild Strawberry Cream",
    category: "ice-cream",
    description: "Sun-ripened strawberry puree folded into rich double cream with crushed waffle crumbles.",
    price: 4.95,
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80",
    bestseller: true,
    badge: "Bestseller",
    isVeg: true,
    calories: "280 kcal"
  },
  {
    id: "ic-2",
    name: "Madagascar Vanilla Bean & Cocoa Duo",
    category: "ice-cream",
    description: "Pure Bourbon vanilla bean paired with Belgian dark chocolate in a freshly rolled waffle cone.",
    price: 5.25,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80",
    bestseller: true,
    badge: "Classic Choice",
    isVeg: true,
    calories: "310 kcal"
  },
  {
    id: "ic-3",
    name: "Sicilian Pistachio Royale",
    category: "ice-cream",
    description: "Authentic roasted Italian pistachios with sea salt flakes and roasted pistachio nibs.",
    price: 5.75,
    image: "https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&w=800&q=80",
    bestseller: true,
    badge: "Staff Pick",
    isVeg: true,
    calories: "320 kcal"
  },
  {
    id: "ic-4",
    name: "Dark Fudge Truffle",
    category: "ice-cream",
    description: "70% Ecuadorian dark chocolate with ribbons of gooey hot fudge and brownie pieces.",
    price: 5.45,
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=800&q=80",
    bestseller: false,
    badge: "Decadent",
    isVeg: true,
    calories: "340 kcal"
  },
  {
    id: "ic-5",
    name: "Salted Caramel Butterscotch",
    category: "ice-cream",
    description: "Buttery slow-simmered toffee swirl with Maldon sea salt crystals in golden cream.",
    price: 5.15,
    image: "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?auto=format&fit=crop&w=800&q=80",
    bestseller: false,
    badge: "Sweet & Salty",
    isVeg: true,
    calories: "295 kcal"
  },

  // --- THICK SHAKES ---
  {
    id: "sh-1",
    name: "Loaded Oreo Crush Thickshake",
    category: "shakes",
    description: "Thick vanilla custard blended with 5 whole Oreos, crowned with chantilly whipped cream & cookie dust.",
    price: 6.95,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    bestseller: true,
    badge: "Top Rated",
    isVeg: true,
    calories: "520 kcal"
  },
  {
    id: "sh-2",
    name: "Strawberry Shortcake Shake",
    category: "shakes",
    description: "Fresh strawberry puree, vanilla gelato, biscuit crust crumbles, and berry drizzle.",
    price: 6.75,
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80",
    bestseller: true,
    badge: "Fan Favorite",
    isVeg: true,
    calories: "460 kcal"
  },
  {
    id: "sh-3",
    name: "Triple Belgian Chocolate Malt",
    category: "shakes",
    description: "Dark chocolate ganache, malted milk powder, and rich chocolate shavings on top.",
    price: 6.95,
    image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80",
    bestseller: false,
    badge: "Ultra Thick",
    isVeg: true,
    calories: "540 kcal"
  },
  {
    id: "sh-4",
    name: "Tropical Alphonso Mango Shake",
    category: "shakes",
    description: "Sun-drenched Alphonso mango pulp blended with vanilla bean ice cream and cardamom aroma.",
    price: 6.50,
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80",
    bestseller: false,
    badge: "Seasonal",
    isVeg: true,
    calories: "410 kcal"
  },
  {
    id: "sh-5",
    name: "Vanilla Frappé 🥤",
    category: "shakes",
    description: "Blended with smooth vanilla bean, chilled milk, and crushed ice for the perfect refreshing treat.",
    price: 7.60,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    bestseller: false,
    badge: "Chilled",
    isVeg: true,
    calories: "380 kcal"
  },

  // --- SUNDAES & WAFFLES ---
  {
    id: "des-1",
    name: "Golden Berry Belgian Waffle",
    category: "sundaes-waffles",
    description: "Crispy outer, fluffy core Belgian waffle topped with fresh berries, vanilla scoop, and maple glaze.",
    price: 8.95,
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80",
    bestseller: true,
    badge: "Signature",
    isVeg: true,
    calories: "590 kcal"
  },
  {
    id: "des-2",
    name: "Sizzling Hot Brownie Sundae",
    category: "sundaes-waffles",
    description: "Warm fudgy chocolate brownie topped with double vanilla scoops, warm chocolate syrup, and toasted pecans.",
    price: 8.50,
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80",
    bestseller: true,
    badge: "Must Try",
    isVeg: true,
    calories: "620 kcal"
  },
  {
    id: "des-3",
    name: "Caramelized Lotus Biscoff Waffle",
    category: "sundaes-waffles",
    description: "Fresh waffle drenched in warm speculoos cookie butter, crunchy Lotus crumbles, and vanilla bean cream.",
    price: 9.25,
    image: "https://images.unsplash.com/photo-1598214886806-c87b84b7078b?auto=format&fit=crop&w=800&q=80",
    bestseller: false,
    badge: "New Delight",
    isVeg: true,
    calories: "640 kcal"
  },

  // --- BURGERS & SANDWICHES ---
  {
    id: "bg-1",
    name: "Sizzle Smash Cheeseburger",
    category: "burgers",
    description: "Double smashed certified Angus patties, melted aged cheddar, caramelized onions, house secret sauce on buttery brioche.",
    price: 9.95,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    bestseller: true,
    badge: "House Hero",
    isVeg: false,
    calories: "710 kcal"
  },
  {
    id: "bg-2",
    name: "Crispy Buttermilk Hot Bird",
    category: "burgers",
    description: "24-hr brined crispy chicken breast, house dill pickles, tangy purple slaw, and smoked paprika garlic aioli.",
    price: 9.45,
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80",
    bestseller: true,
    badge: "Crispy Favorite",
    isVeg: false,
    calories: "680 kcal"
  },
  {
    id: "bg-3",
    name: "Artisan Toasted Club Sandwich",
    category: "burgers",
    description: "Triple-decker sourdough with smoked turkey breast, crispy bacon strips, ripe avocado, vine tomato, and herb mayo.",
    price: 8.95,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    bestseller: false,
    badge: "Comfort Classic",
    isVeg: false,
    calories: "550 kcal"
  },

  // --- FRIES & HOT SNACKS ---
  {
    id: "sn-1",
    name: "Truffle & Parmesan Seasoned Fries",
    category: "hot-snacks",
    description: "Skin-on crispy shoestring fries tossed in white truffle oil, grated aged parmesan, and fresh rosemary flakes.",
    price: 5.75,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    bestseller: true,
    badge: "Best Seller Side",
    isVeg: true,
    calories: "410 kcal"
  },
  {
    id: "sn-2",
    name: "Crisp Mozzarella Melts",
    category: "hot-snacks",
    description: "Golden herb-crusted stringy mozzarella sticks served with warm marinara dipping sauce.",
    price: 6.25,
    image: "https://images.unsplash.com/photo-1548340748-6d2b7d7da280?auto=format&fit=crop&w=800&q=80",
    bestseller: false,
    badge: "Cheesy",
    isVeg: true,
    calories: "440 kcal"
  },
  {
    id: "sn-3",
    name: "Smoky BBQ Chicken Bites",
    category: "hot-snacks",
    description: "Bite-sized tender buttermilk chicken chunks tossed in hickory honey BBQ sauce with ranch dip.",
    price: 6.95,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
    bestseller: false,
    badge: "Spicy & Sweet",
    isVeg: false,
    calories: "490 kcal"
  }
];

export const SPECIAL_OFFERS = [
  {
    id: "combo-1",
    tag: "MOST POPULAR COMBO",
    title: "Sweet & Sizzle Duo",
    description: "1 Sizzle Smash Cheeseburger + 1 Truffle Herb Fries + 1 Loaded Thickshake of your choice.",
    price: 19.99,
    originalPrice: 22.65,
    badge: "Save $2.66",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    includes: ["Sizzle Smash Cheeseburger", "Truffle Fries", "Choice of Thickshake"]
  },
  {
    id: "combo-2",
    tag: "DESSERT LOVER",
    title: "Belgian Waffle & Ice Cream Feast",
    description: "1 Golden Berry Belgian Waffle + 2 Large Artisan Ice Cream Cones for the sweetest date.",
    price: 16.50,
    originalPrice: 18.85,
    badge: "Save $2.35",
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80",
    includes: ["Belgian Waffle", "2 Artisanal Scoops"]
  },
  {
    id: "combo-3",
    tag: "FAMILY BUNDLE",
    title: "Weekend Family Treat Box",
    description: "2 Gourmet Burgers, 2 Crispy Fries, 2 Artisan Scoops, and 2 Thickshakes. Fun for the whole table!",
    price: 38.00,
    originalPrice: 44.50,
    badge: "Save $6.50",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
    includes: ["2 Gourmet Burgers", "2 Fries", "2 Ice Creams", "2 Thickshakes"]
  }
];

export const TESTIMONIALS = [
  {
    quote: "The contrast between the sizzling hot smash burger and the cold wild strawberry ice cream is absolute perfection. Scoop & Sizzle is our new weekend ritual!",
    name: "Elena Rostova",
    role: "Local Food Explorer",
    rating: 5,
    favorite: "Wild Strawberry & Smash Burger"
  },
  {
    quote: "Hands down the thickest Oreo shake in the valley. You can taste the real dairy cream. The waffle texture is crisp on the outside and airy inside.",
    name: "Marcus Chen",
    role: "Dessert Enthusiast",
    rating: 5,
    favorite: "Loaded Oreo Shake"
  },
  {
    quote: "Super convenient ordering straight over WhatsApp! The order was prepared fresh, packed warm, and the ice cream was kept nicely chilled in insulated tubs.",
    name: "Sarah Jenkins",
    role: "Neighbourhood Regular",
    rating: 5,
    favorite: "Sizzling Brownie Sundae"
  }
];
