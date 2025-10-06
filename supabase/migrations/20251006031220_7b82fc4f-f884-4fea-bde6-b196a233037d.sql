-- Create table for knowledge base sources
CREATE TABLE public.knowledge_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  title TEXT,
  content TEXT,
  fetched_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for content chunks (for better search)
CREATE TABLE public.knowledge_chunks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID NOT NULL REFERENCES public.knowledge_sources(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can read the knowledge base)
CREATE POLICY "Anyone can view knowledge sources"
ON public.knowledge_sources
FOR SELECT
USING (true);

CREATE POLICY "Anyone can view knowledge chunks"
ON public.knowledge_chunks
FOR SELECT
USING (true);

-- Create indexes for better search performance
CREATE INDEX idx_knowledge_chunks_source_id ON public.knowledge_chunks(source_id);
CREATE INDEX idx_knowledge_chunks_content ON public.knowledge_chunks USING gin(to_tsvector('english', content));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_knowledge_sources_updated_at
BEFORE UPDATE ON public.knowledge_sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();