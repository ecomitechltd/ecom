-- Create pharmacy database tables
-- Current time: 2025-10-27 11:08 UTC

-- Categories table for organizing products
CREATE TABLE IF NOT EXISTS public.categories_2025_10_27_11_08 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table for medications and health products
CREATE TABLE IF NOT EXISTS public.products_2025_10_27_11_08 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    category_id UUID REFERENCES public.categories_2025_10_27_11_08(id),
    requires_prescription BOOLEAN DEFAULT FALSE,
    in_stock INTEGER DEFAULT 0,
    sku VARCHAR(50) UNIQUE,
    manufacturer VARCHAR(100),
    dosage VARCHAR(50),
    active_ingredients TEXT,
    side_effects TEXT,
    usage_instructions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles_2025_10_27_11_08 (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    postal_code VARCHAR(20),
    date_of_birth DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders_2025_10_27_11_08 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_method VARCHAR(20) DEFAULT 'cod' CHECK (payment_method IN ('cod', 'online')),
    delivery_address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS public.order_items_2025_10_27_11_08 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders_2025_10_27_11_08(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products_2025_10_27_11_08(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prescriptions table
CREATE TABLE IF NOT EXISTS public.prescriptions_2025_10_27_11_08 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    order_id UUID REFERENCES public.orders_2025_10_27_11_08(id),
    prescription_image_url TEXT NOT NULL,
    doctor_name VARCHAR(100),
    doctor_license VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews_2025_10_27_11_08 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    product_id UUID REFERENCES public.products_2025_10_27_11_08(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample categories
INSERT INTO public.categories_2025_10_27_11_08 (name, description) VALUES
('Pain Relief', 'Medications for pain management and relief'),
('Cold & Flu', 'Treatments for cold, flu, and respiratory conditions'),
('Vitamins & Supplements', 'Health supplements and vitamins'),
('First Aid', 'First aid supplies and emergency medications'),
('Prescription Drugs', 'Prescription medications requiring doctor approval'),
('Personal Care', 'Personal hygiene and care products');

-- Insert sample products
INSERT INTO public.products_2025_10_27_11_08 (name, description, price, category_id, requires_prescription, in_stock, sku, manufacturer, dosage, active_ingredients, usage_instructions) VALUES
('Paracetamol 500mg', 'Effective pain relief and fever reducer', 5.99, (SELECT id FROM public.categories_2025_10_27_11_08 WHERE name = 'Pain Relief'), FALSE, 100, 'PAR500', 'PharmaCorp', '500mg', 'Paracetamol', 'Take 1-2 tablets every 4-6 hours as needed'),
('Ibuprofen 400mg', 'Anti-inflammatory pain reliever', 7.50, (SELECT id FROM public.categories_2025_10_27_11_08 WHERE name = 'Pain Relief'), FALSE, 80, 'IBU400', 'MediCare', '400mg', 'Ibuprofen', 'Take 1 tablet every 6-8 hours with food'),
('Vitamin C 1000mg', 'Immune system support supplement', 12.99, (SELECT id FROM public.categories_2025_10_27_11_08 WHERE name = 'Vitamins & Supplements'), FALSE, 150, 'VITC1000', 'HealthPlus', '1000mg', 'Ascorbic Acid', 'Take 1 tablet daily with meals'),
('Cough Syrup', 'Effective cough suppressant and expectorant', 8.75, (SELECT id FROM public.categories_2025_10_27_11_08 WHERE name = 'Cold & Flu'), FALSE, 60, 'COUGH001', 'ReliefMed', '100ml', 'Dextromethorphan', 'Take 10ml every 4 hours as needed'),
('Antibiotics Pack', 'Prescription antibiotic treatment', 25.00, (SELECT id FROM public.categories_2025_10_27_11_08 WHERE name = 'Prescription Drugs'), TRUE, 40, 'ANTI001', 'PharmaMax', 'Various', 'Amoxicillin', 'Take as prescribed by doctor'),
('First Aid Kit', 'Complete first aid emergency kit', 19.99, (SELECT id FROM public.categories_2025_10_27_11_08 WHERE name = 'First Aid'), FALSE, 25, 'FIRST001', 'SafeCare', 'Kit', 'Various supplies', 'Use as needed for minor injuries');

-- Enable Row Level Security
ALTER TABLE public.categories_2025_10_27_11_08 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products_2025_10_27_11_08 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles_2025_10_27_11_08 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders_2025_10_27_11_08 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items_2025_10_27_11_08 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions_2025_10_27_11_08 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews_2025_10_27_11_08 ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Categories and products are public for viewing
CREATE POLICY "Categories are viewable by everyone" ON public.categories_2025_10_27_11_08 FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON public.products_2025_10_27_11_08 FOR SELECT USING (true);

-- User profiles - users can only access their own
CREATE POLICY "Users can view own profile" ON public.user_profiles_2025_10_27_11_08 FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles_2025_10_27_11_08 FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles_2025_10_27_11_08 FOR UPDATE USING (auth.uid() = id);

-- Orders - users can only access their own orders
CREATE POLICY "Users can view own orders" ON public.orders_2025_10_27_11_08 FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON public.orders_2025_10_27_11_08 FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON public.orders_2025_10_27_11_08 FOR UPDATE USING (auth.uid() = user_id);

-- Order items - users can access items from their orders
CREATE POLICY "Users can view own order items" ON public.order_items_2025_10_27_11_08 FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders_2025_10_27_11_08 WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create own order items" ON public.order_items_2025_10_27_11_08 FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders_2025_10_27_11_08 WHERE id = order_id AND user_id = auth.uid())
);

-- Prescriptions - users can only access their own
CREATE POLICY "Users can view own prescriptions" ON public.prescriptions_2025_10_27_11_08 FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own prescriptions" ON public.prescriptions_2025_10_27_11_08 FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reviews - users can view all reviews but only create/update their own
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews_2025_10_27_11_08 FOR SELECT USING (true);
CREATE POLICY "Users can create own reviews" ON public.reviews_2025_10_27_11_08 FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews_2025_10_27_11_08 FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products_2025_10_27_11_08(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products_2025_10_27_11_08(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders_2025_10_27_11_08(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders_2025_10_27_11_08(status);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews_2025_10_27_11_08(product_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_user ON public.prescriptions_2025_10_27_11_08(user_id);