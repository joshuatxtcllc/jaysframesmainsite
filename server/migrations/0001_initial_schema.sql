
-- Initial schema for Jay's Frames
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    is_admin BOOLEAN DEFAULT false,
    role TEXT DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    address JSONB
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    sale_price INTEGER,
    category TEXT NOT NULL,
    subcategory TEXT,
    image_url TEXT,
    images JSONB,
    details JSONB,
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    sku TEXT UNIQUE,
    barcode TEXT,
    weight INTEGER,
    dimensions JSONB,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tags JSONB,
    related_product_ids JSONB,
    supplier_info JSONB,
    reorder_point INTEGER DEFAULT 3,
    reorder_quantity INTEGER DEFAULT 10,
    last_restock_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    total_amount INTEGER NOT NULL,
    items JSONB NOT NULL,
    shipping_address JSONB,
    billing_address JSONB,
    payment_status TEXT DEFAULT 'pending',
    payment_method TEXT,
    payment_id TEXT,
    tracking_number TEXT,
    shipping_method TEXT,
    shipping_cost INTEGER DEFAULT 0,
    tax_amount INTEGER DEFAULT 0,
    discount INTEGER DEFAULT 0,
    coupon_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    estimated_delivery_date TIMESTAMP,
    current_stage TEXT NOT NULL DEFAULT 'order_received',
    stage_history JSONB DEFAULT '[]',
    notes TEXT,
    admin_notes TEXT
);

CREATE TABLE IF NOT EXISTS frame_options (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    material TEXT NOT NULL,
    price_per_inch INTEGER NOT NULL,
    image_url TEXT,
    width INTEGER DEFAULT 25,
    details JSONB
);

CREATE TABLE IF NOT EXISTS mat_options (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    price INTEGER NOT NULL,
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS reveal_sizes (
    id SERIAL PRIMARY KEY,
    size TEXT NOT NULL,
    size_inches INTEGER NOT NULL,
    display_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS glass_options (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    author_id INTEGER REFERENCES users(id),
    category_id INTEGER REFERENCES blog_categories(id),
    status VARCHAR(20) DEFAULT 'draft' NOT NULL,
    meta_title VARCHAR(200),
    meta_description TEXT,
    keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    published_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
