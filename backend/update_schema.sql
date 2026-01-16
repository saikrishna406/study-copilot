-- Run this in your Supabase SQL Editor to update the table structure

ALTER TABLE study_plans ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE study_plans ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE study_plans ADD COLUMN IF NOT EXISTS exam_date DATE;
ALTER TABLE study_plans ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived'));

-- Only run this if you want to reset the table completely (WARNING: DELETES DATA)
-- DROP TABLE study_plans;
-- Then run the CREATE TABLE block from schema.sql
