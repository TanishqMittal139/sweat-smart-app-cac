-- Add preferred unit system to profiles table
ALTER TABLE public.profiles 
ADD COLUMN preferred_unit_system text DEFAULT 'metric' CHECK (preferred_unit_system IN ('metric', 'imperial'));