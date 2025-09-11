CREATE POLICY "Users can manage themselves" ON users USING (id = ihp_user_id()) WITH CHECK (id = ihp_user_id());
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
