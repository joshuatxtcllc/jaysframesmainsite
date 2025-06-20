
-- Add discount codes table
CREATE TABLE IF NOT EXISTS discount_codes (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  percentage INTEGER NOT NULL,
  min_order_amount INTEGER,
  max_discount_amount INTEGER,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

-- Create index for faster code lookups
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_discount_codes_expires_at ON discount_codes(expires_at);

-- Insert some sample discount codes
INSERT INTO discount_codes (code, description, percentage, min_order_amount, is_active) VALUES
('WELCOME10', '10% off for new customers', 10, 5000, true),
('SAVE15', '15% off orders over $100', 15, 10000, true),
('HOLIDAY20', '20% off holiday special', 20, 7500, true);
