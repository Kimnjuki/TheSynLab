-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Admins can insert products" ON public.nova_products;
DROP POLICY IF EXISTS "Admins can update products" ON public.nova_products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.nova_products;
DROP POLICY IF EXISTS "Anyone can view published products" ON public.nova_products;

-- Add RLS policies to nova_products for admin management
CREATE POLICY "Admins can insert products"
  ON public.nova_products
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
  ON public.nova_products
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
  ON public.nova_products
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Everyone can view published products
CREATE POLICY "Anyone can view published products"
  ON public.nova_products
  FOR SELECT
  USING (status = 'active' OR public.has_role(auth.uid(), 'admin'));