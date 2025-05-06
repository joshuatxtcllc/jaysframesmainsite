
-- Add the missing width column to frame_options table
ALTER TABLE IF EXISTS frame_options ADD COLUMN IF NOT EXISTS width INTEGER;
