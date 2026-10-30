CREATE TABLE public.consultation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  graduation_year TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) can submit a consultation request
CREATE POLICY "Anyone can submit a consultation request"
  ON public.consultation_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can read submissions (you, via the dashboard)
CREATE POLICY "Authenticated users can read consultation requests"
  ON public.consultation_requests
  FOR SELECT
  TO authenticated
  USING (true);