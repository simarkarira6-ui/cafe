-- =============================================================================
-- Scoop & Sizzle - Supabase Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/cvrqfqmketfhcrdlqcws/sql)
-- =============================================================================

-- 1. Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    short_title TEXT NOT NULL,
    count TEXT,
    description TEXT,
    image TEXT,
    badge TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image TEXT,
    bestseller BOOLEAN DEFAULT false,
    badge TEXT,
    is_veg BOOLEAN DEFAULT true,
    is_available BOOLEAN DEFAULT true,
    calories TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    order_type TEXT DEFAULT 'Pickup / Takeaway',
    notes TEXT,
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Preparing', 'Ready', 'Completed', 'Cancelled')),
    whatsapp_sent BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Store Configuration Table
CREATE TABLE IF NOT EXISTS public.store_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Enable Row Level Security (RLS) and grant read/write access for public anon key
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_config ENABLE ROW LEVEL SECURITY;

-- Create policies allowing read access to anyone
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read menu_items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Allow public read store_config" ON public.store_config FOR SELECT USING (true);

-- Create policies allowing insert/update/delete for anon key
CREATE POLICY "Allow public insert/update categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert/update menu_items" ON public.menu_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select/update orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public update store_config" ON public.store_config FOR ALL USING (true) WITH CHECK (true);

-- 7. Seed Initial Categories
INSERT INTO public.categories (id, title, short_title, count, description, image, badge, sort_order)
VALUES
('ice-cream', 'Handcrafted Ice Cream', 'Ice Cream', '12 Flavors', 'Slow-churned daily with fresh cream & organic pure extracts.', 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80', 'Popular', 1),
('shakes', 'Velvet Thick Shakes', 'Thick Shakes', '8 Varieties', 'Ultra-thick, triple-blended with whole milk and real toppings.', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', 'Indulgent', 2),
('sundaes-waffles', 'Sundaes & Waffles', 'Sundaes & Waffles', '7 Treats', 'Freshly pressed golden Belgian waffles topped with warm fudge & gelato.', 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80', 'Warm & Cold', 3),
('burgers', 'Burgers & Sandwiches', 'Burgers & Sandwiches', '6 Burgers', 'Sizzling smashed Angus beef and buttermilk fried chicken on toasted brioche.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', 'Sizzling Hot', 4),
('hot-snacks', 'Fries & Hot Snacks', 'Fries & Hot Snacks', '6 Sides', 'Golden seasoned loaded fries, melted cheese sticks, and crispy tenders.', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80', 'Crispy Crunch', 5)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  short_title = EXCLUDED.short_title,
  description = EXCLUDED.description,
  image = EXCLUDED.image;

-- 8. Seed Initial Menu Items
INSERT INTO public.menu_items (id, name, category, description, price, image, bestseller, badge, is_veg, calories, sort_order)
VALUES
('ic-1', 'Wild Strawberry Cream', 'ice-cream', 'Sun-ripened strawberry puree folded into rich double cream with crushed waffle crumbles.', 4.95, 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80', true, 'Bestseller', true, '280 kcal', 1),
('ic-2', 'Madagascar Vanilla Bean & Cocoa Duo', 'ice-cream', 'Pure Bourbon vanilla bean paired with Belgian dark chocolate in a freshly rolled waffle cone.', 5.25, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80', true, 'Classic Choice', true, '310 kcal', 2),
('ic-3', 'Sicilian Pistachio Royale', 'ice-cream', 'Authentic roasted Italian pistachios with sea salt flakes and roasted pistachio nibs.', 5.75, 'https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&w=800&q=80', true, 'Staff Pick', true, '320 kcal', 3),
('ic-4', 'Dark Fudge Truffle', 'ice-cream', '70% Ecuadorian dark chocolate with ribbons of gooey hot fudge and brownie pieces.', 5.45, 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=800&q=80', false, 'Decadent', true, '340 kcal', 4),
('ic-5', 'Salted Caramel Butterscotch', 'ice-cream', 'Buttery slow-simmered toffee swirl with Maldon sea salt crystals in golden cream.', 5.15, 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?auto=format&fit=crop&w=800&q=80', false, 'Sweet & Salty', true, '295 kcal', 5),
('sh-1', 'Loaded Oreo Crush Thickshake', 'shakes', 'Thick vanilla custard blended with 5 whole Oreos, crowned with chantilly whipped cream & cookie dust.', 6.95, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80', true, 'Top Rated', true, '520 kcal', 6),
('sh-2', 'Strawberry Shortcake Shake', 'shakes', 'Fresh strawberry puree, vanilla gelato, biscuit crust crumbles, and berry drizzle.', 6.75, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80', true, 'Fan Favorite', true, '460 kcal', 7),
('sh-3', 'Triple Belgian Chocolate Malt', 'shakes', 'Dark chocolate ganache, malted milk powder, and rich chocolate shavings on top.', 6.95, 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80', false, 'Ultra Thick', true, '540 kcal', 8),
('sh-4', 'Tropical Alphonso Mango Shake', 'shakes', 'Sun-drenched Alphonso mango pulp blended with vanilla bean ice cream and cardamom aroma.', 6.50, 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80', false, 'Seasonal', true, '410 kcal', 9),
('des-1', 'Golden Berry Belgian Waffle', 'sundaes-waffles', 'Crispy outer, fluffy core Belgian waffle topped with fresh berries, vanilla scoop, and maple glaze.', 8.95, 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80', true, 'Signature', true, '590 kcal', 10),
('des-2', 'Sizzling Hot Brownie Sundae', 'sundaes-waffles', 'Warm fudgy chocolate brownie topped with double vanilla scoops, warm chocolate syrup, and toasted pecans.', 8.50, 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80', true, 'Must Try', true, '620 kcal', 11),
('des-3', 'Caramelized Lotus Biscoff Waffle', 'sundaes-waffles', 'Fresh waffle drenched in warm speculoos cookie butter, crunchy Lotus crumbles, and vanilla bean cream.', 9.25, 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?auto=format&fit=crop&w=800&q=80', false, 'New Delight', true, '640 kcal', 12),
('bg-1', 'Sizzle Smash Cheeseburger', 'burgers', 'Double smashed certified Angus patties, melted aged cheddar, caramelized onions, house secret sauce on buttery brioche.', 9.95, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', true, 'House Hero', false, '710 kcal', 13),
('bg-2', 'Crispy Buttermilk Hot Bird', 'burgers', '24-hr brined crispy chicken breast, house dill pickles, tangy purple slaw, and smoked paprika garlic aioli.', 9.45, 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80', true, 'Crispy Favorite', false, '680 kcal', 14),
('bg-3', 'Artisan Toasted Club Sandwich', 'burgers', 'Triple-decker sourdough with smoked turkey breast, crispy bacon strips, ripe avocado, vine tomato, and herb mayo.', 8.95, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', false, 'Comfort Classic', false, '550 kcal', 15),
('sn-1', 'Truffle & Parmesan Seasoned Fries', 'hot-snacks', 'Skin-on crispy shoestring fries tossed in white truffle oil, grated aged parmesan, and fresh rosemary flakes.', 5.75, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80', true, 'Best Seller Side', true, '410 kcal', 16),
('sn-2', 'Crisp Mozzarella Melts', 'hot-snacks', 'Golden herb-crusted stringy mozzarella sticks served with warm marinara dipping sauce.', 6.25, 'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?auto=format&fit=crop&w=800&q=80', false, 'Cheesy', true, '440 kcal', 17),
('sn-3', 'Smoky BBQ Chicken Bites', 'hot-snacks', 'Bite-sized tender buttermilk chicken chunks tossed in hickory honey BBQ sauce with ranch dip.', 6.95, 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80', false, 'Spicy & Sweet', false, '490 kcal', 18)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  bestseller = EXCLUDED.bestseller,
  badge = EXCLUDED.badge;
