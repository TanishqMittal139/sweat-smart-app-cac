-- Create quiz_questions table to store the question bank
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on quiz_questions table
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read questions (since it's a quiz)
CREATE POLICY "Anyone can view quiz questions" 
ON public.quiz_questions 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_quiz_questions_updated_at
BEFORE UPDATE ON public.quiz_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert 30 diverse health questions into the question bank
INSERT INTO public.quiz_questions (question, options, correct_answer, explanation, category) VALUES
('Which of these is the most effective strategy for sustainable weight loss?', 
 '["Extreme calorie restriction (under 1000 calories/day)", "Creating a moderate calorie deficit (300-500 calories/day) with balanced nutrition", "Eliminating entire food groups permanently", "Only eating once per day"]', 
 1, 
 'A moderate calorie deficit combined with balanced nutrition is sustainable and preserves muscle mass while promoting fat loss.', 
 'Weight Management'),

('How much water should an average adult drink per day?', 
 '["4 glasses (32 oz)", "6 glasses (48 oz)", "8 glasses (64 oz)", "12 glasses (96 oz)"]', 
 2, 
 'The ''8x8 rule'' (8 glasses of 8 ounces) is a good general guideline, though individual needs may vary based on activity and climate.', 
 'Hydration'),

('What''s the recommended amount of moderate aerobic activity per week for adults?', 
 '["75 minutes", "150 minutes", "300 minutes", "500 minutes"]', 
 1, 
 'The CDC recommends at least 150 minutes of moderate-intensity aerobic activity per week, plus muscle-strengthening activities twice a week.', 
 'Exercise'),

('Which sleep duration is associated with the best health outcomes for most adults?', 
 '["5-6 hours", "6-7 hours", "7-9 hours", "9-10 hours"]', 
 2, 
 'Adults aged 18-64 should aim for 7-9 hours of sleep per night for optimal health, cognitive function, and recovery.', 
 'Sleep'),

('What''s a myth about metabolism?', 
 '["Muscle tissue burns more calories than fat tissue", "Eating frequent small meals dramatically boosts metabolism", "Age affects metabolic rate", "Exercise increases metabolic rate"]', 
 1, 
 'While eating does temporarily increase metabolism, frequent small meals don''t provide a significant advantage over fewer, larger meals.', 
 'Nutrition Myths'),

('What percentage of your plate should be filled with fruits and vegetables according to MyPlate guidelines?', 
 '["25%", "33%", "50%", "75%"]', 
 2, 
 'The MyPlate guidelines recommend that half of your plate should be fruits and vegetables for optimal nutrition.', 
 'Nutrition'),

('Which type of fat should you limit most in your diet?', 
 '["Monounsaturated fats", "Polyunsaturated fats", "Trans fats", "Omega-3 fatty acids"]', 
 2, 
 'Trans fats should be limited as much as possible as they increase bad cholesterol and lower good cholesterol, raising heart disease risk.', 
 'Nutrition'),

('How many days per week should adults do muscle-strengthening activities?', 
 '["1 day", "2 days", "3 days", "Every day"]', 
 1, 
 'Adults should do muscle-strengthening activities that work all major muscle groups on 2 or more days per week.', 
 'Exercise'),

('What''s the normal resting heart rate range for adults?', 
 '["40-60 bpm", "60-100 bpm", "80-120 bpm", "100-140 bpm"]', 
 1, 
 'A normal resting heart rate for adults ranges from 60 to 100 beats per minute, though athletes may have lower rates.', 
 'Cardiovascular Health'),

('Which nutrient is most important for bone health?', 
 '["Vitamin C", "Calcium", "Iron", "Vitamin B12"]', 
 1, 
 'Calcium is essential for bone health, working with vitamin D to build and maintain strong bones throughout life.', 
 'Bone Health'),

('What''s the recommended daily sodium intake limit for most adults?', 
 '["1,500 mg", "2,300 mg", "3,000 mg", "4,000 mg"]', 
 1, 
 'The American Heart Association recommends no more than 2,300 mg of sodium per day, with an ideal limit of 1,500 mg for most adults.', 
 'Cardiovascular Health'),

('Which is the best source of complete protein?', 
 '["Rice", "Beans", "Eggs", "Bread"]', 
 2, 
 'Eggs contain all nine essential amino acids, making them a complete protein source that''s easily absorbed by the body.', 
 'Nutrition'),

('How often should adults get a comprehensive physical exam?', 
 '["Every 6 months", "Annually", "Every 2 years", "Every 5 years"]', 
 1, 
 'Most adults should have an annual physical exam to monitor health status and catch potential issues early.', 
 'Preventive Care'),

('What''s the primary benefit of high-intensity interval training (HIIT)?', 
 '["Burns more calories during exercise only", "Increases metabolism for hours after exercise", "Only improves flexibility", "Decreases muscle mass"]', 
 1, 
 'HIIT creates an "afterburn effect" (EPOC) that keeps your metabolism elevated for hours after exercise, burning additional calories.', 
 'Exercise'),

('Which vitamin is primarily synthesized by sun exposure?', 
 '["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"]', 
 2, 
 'Vitamin D is synthesized in the skin when exposed to UVB radiation from sunlight, though it can also be obtained from foods and supplements.', 
 'Vitamins'),

('What''s the recommended fiber intake for adult women per day?', 
 '["15 grams", "25 grams", "35 grams", "45 grams"]', 
 1, 
 'Adult women should aim for about 25 grams of fiber per day, while men should aim for 38 grams to support digestive health.', 
 'Nutrition'),

('Which stress management technique has been scientifically proven most effective?', 
 '["Watching TV", "Deep breathing exercises", "Shopping", "Eating comfort food"]', 
 1, 
 'Deep breathing exercises activate the parasympathetic nervous system, reducing stress hormones and promoting relaxation.', 
 'Mental Health'),

('What''s the most accurate way to measure body composition?', 
 '["BMI calculation", "Waist-to-hip ratio", "DEXA scan", "Bathroom scale weight"]', 
 2, 
 'DEXA scans provide the most accurate measurement of body composition, including bone density, muscle mass, and fat distribution.', 
 'Body Composition'),

('How long should you wait after eating before exercising intensely?', 
 '["30 minutes", "1-2 hours", "3-4 hours", "6 hours"]', 
 1, 
 'Waiting 1-2 hours after a meal allows for proper digestion and prevents discomfort during intense exercise.', 
 'Exercise Timing'),

('Which cooking method retains the most nutrients in vegetables?', 
 '["Boiling", "Steaming", "Deep frying", "Overcooking"]', 
 1, 
 'Steaming preserves more nutrients than boiling because vitamins don''t leach into cooking water, and the gentle heat protects sensitive nutrients.', 
 'Cooking Methods'),

('What''s the recommended maximum weekly alcohol consumption for women?', 
 '["3 drinks", "7 drinks", "10 drinks", "14 drinks"]', 
 1, 
 'Health guidelines recommend that women limit alcohol to no more than 7 drinks per week to minimize health risks.', 
 'Alcohol Guidelines'),

('Which type of exercise is best for improving bone density?', 
 '["Swimming", "Weight-bearing exercises", "Cycling", "Yoga only"]', 
 1, 
 'Weight-bearing exercises like walking, running, and resistance training stimulate bone formation and help maintain bone density.', 
 'Bone Health'),

('What''s the ideal room temperature for quality sleep?', 
 '["75-78°F", "68-72°F", "60-65°F", "80-85°F"]', 
 2, 
 'A cooler room temperature of 60-67°F (15-19°C) promotes better sleep quality as your body naturally drops in temperature during sleep.', 
 'Sleep Hygiene'),

('Which screening should women start at age 40?', 
 '["Colonoscopy", "Mammogram", "Bone density test", "Skin cancer screening"]', 
 1, 
 'Women should begin annual mammogram screening at age 40-50 (depending on risk factors) for early breast cancer detection.', 
 'Preventive Care'),

('What''s the most effective way to prevent foodborne illness?', 
 '["Eating organic food only", "Proper hand washing", "Using antibacterial soap on food", "Microwaving all food"]', 
 1, 
 'Proper hand washing with soap and water for at least 20 seconds is the most effective way to prevent foodborne illnesses.', 
 'Food Safety'),

('Which nutrient deficiency is most common worldwide?', 
 '["Vitamin C", "Iron", "Protein", "Calcium"]', 
 1, 
 'Iron deficiency is the most common nutritional deficiency worldwide, particularly affecting women of childbearing age.', 
 'Nutrition Deficiencies'),

('What''s the recommended frequency for dental checkups?', 
 '["Every 3 months", "Every 6 months", "Once a year", "Every 2 years"]', 
 1, 
 'Most dental professionals recommend checkups and cleanings every 6 months to maintain oral health and catch issues early.', 
 'Oral Health'),

('Which factor has the greatest impact on longevity?', 
 '["Genetics only", "Lifestyle choices", "Income level", "Geographic location"]', 
 1, 
 'While genetics play a role, lifestyle choices like diet, exercise, sleep, and stress management have the greatest impact on longevity and healthspan.', 
 'Longevity'),

('What''s the primary cause of type 2 diabetes?', 
 '["Eating too much sugar", "Insulin resistance", "Lack of exercise only", "Genetic factors only"]', 
 1, 
 'Type 2 diabetes is primarily caused by insulin resistance, where cells don''t respond properly to insulin, often linked to obesity and lifestyle factors.', 
 'Diabetes'),

('Which mental health practice shows the most scientific evidence for reducing anxiety?', 
 '["Positive thinking only", "Mindfulness meditation", "Avoiding all stress", "Sleeping more"]', 
 1, 
 'Mindfulness meditation has extensive scientific evidence showing it effectively reduces anxiety by changing brain structure and stress response patterns.', 
 'Mental Health');