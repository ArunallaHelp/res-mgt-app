-- Replace age and dob with birth_year
ALTER TABLE public.requests ADD COLUMN IF NOT EXISTS birth_year TEXT; -- Using TEXT to be safe with form data, or INTEGER if strict. Let's use TEXT to match other fields like grade/exam_year for simplicity, or INTEGER for correctness. Plan said INTEGER. Let's stick to INTEGER but handle conversion. Actually, let's use TEXT to avoid parsing issues if user enters something weird, but for a year dropdown INTEGER is better. Let's go with TEXT to be safe and consistent with other fields like 'age' which was integer but 'grade' is text. Wait, age was integer. Let's make birth_year INTEGER.

ALTER TABLE public.requests ADD COLUMN IF NOT EXISTS birth_year INTEGER;
ALTER TABLE public.requests DROP COLUMN IF EXISTS age;
ALTER TABLE public.requests DROP COLUMN IF EXISTS dob;
