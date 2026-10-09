# 🍨 Scoop & Sizzle — Supabase & Admin Panel Documentation

## 1. Overview
Your café website is now connected to **Supabase** and equipped with a full **Admin Dashboard** (`/admin.html`).

### Configured Supabase Credentials:
* **Project URL:** `https://cvrqfqmketfhcrdlqcws.supabase.co`
* **Project Ref:** `cvrqfqmketfhcrdlqcws`
* **Publishable Key:** `sb_publishable_HuUrhH3XcBtRbOebAmiK7g_Ul2jVEPd`
* **Anon JWT Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 2. Accessing the Admin Panel
1. Open [`admin.html`](http://localhost:8080/admin.html) in your browser (or click **🔐 Owner Admin Portal** in the website footer).
2. Default Security PIN: **`1234`** (or `admin`).
3. You can exit/lock the portal anytime using the **Exit** button in the top navbar.

---

## 3. One-Click Supabase Database Initialization
To create your database tables and seed them with the 18 initial café menu items:

1. Open your Supabase SQL Editor:  
   👉 [https://supabase.com/dashboard/project/cvrqfqmketfhcrdlqcws/sql](https://supabase.com/dashboard/project/cvrqfqmketfhcrdlqcws/sql)
2. Copy the entire contents of [`supabase_schema.sql`](file:///c:/Users/omc/Desktop/FUN%20WEB/supabase_schema.sql) (or click **"Copy SQL Schema Script"** inside the Admin Panel under the **🗄️ Supabase Cloud** tab).
3. Paste the SQL query into the Supabase query editor and click **Run**.
4. All tables (`menu_items`, `orders`, `categories`, `store_config`) with proper Row-Level Security policies will be immediately created and populated!

> 💡 **Offline / Fallback Resilience:**  
> Even before running the SQL script, the website and Admin Panel operate seamlessly via local caching. Once the tables are created, it automatically synchronizes in real-time.

---

## 4. Key Features Implemented

### A. Customer Website (`index.html`)
* **Editorial Aesthetic:** Soft strawberry pink, vanilla cream, chocolate brown, and pistachio accents based on your uploaded design references.
* **Responsive Architecture:** Optimized for mobile phones (320px–430px), tablets (768px), and desktops (1024px–1440px).
* **Menu & Filter System:** Fast category tabs, search bar, dietary tags (🌱 Veg / 🥩 Non-Veg), and item detail cards.
* **Order Tray & WhatsApp Flow:**
  * Customers pick items and adjust quantities.
  * Enter name, phone, pickup/delivery preference, and special instructions.
  * Click **"Send Order via WhatsApp"** to generate a formatted message to the kitchen counter.
  * Simultaneously logs the order to the Supabase database.

### B. Admin Dashboard (`admin.html`)
* **Dashboard Overview:** Live counts of menu items, active categories, total customer orders, and estimated revenue.
* **Menu Manager:** Add, edit, price, and delete menu items with images, calorie counts, badges, and vegetarian toggles.
* **Kitchen Order Tracker:** Live orders with customer name, phone, items list, subtotal, and status selector (`New` → `Preparing` → `Ready` → `Completed`).
* **Store Settings:** Customize café name, tagline, WhatsApp phone number, physical address, and top promo announcement bar without writing code.
