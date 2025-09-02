-- Add biological sex to profiles table
ALTER TABLE public.profiles 
ADD COLUMN biological_sex text CHECK (biological_sex IN ('male', 'female'));