-- Create weight_entries table for tracking weight over time
CREATE TABLE public.weight_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  weight_kg NUMERIC NOT NULL,
  recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.weight_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own weight entries" 
ON public.weight_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weight entries" 
ON public.weight_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weight entries" 
ON public.weight_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weight entries" 
ON public.weight_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add weight goal fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN weight_goal_type TEXT CHECK (weight_goal_type IN ('loss', 'gain')),
ADD COLUMN weight_goal_amount_kg NUMERIC;

-- Create trigger for automatic timestamp updates on weight_entries
CREATE TRIGGER update_weight_entries_updated_at
BEFORE UPDATE ON public.weight_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance on user queries
CREATE INDEX idx_weight_entries_user_id_date ON public.weight_entries(user_id, recorded_date DESC);