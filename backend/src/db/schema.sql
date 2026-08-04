CREATE TABLE users (
  email TEXT PRIMARY KEY,
  password TEXT NOT NULL, -- bcrypt hash
  role TEXT NOT NULL CHECK (role IN ('admin', 'cuina'))
);

CREATE TABLE plats (
  id SERIAL PRIMARY KEY,
  plat TEXT NOT NULL,
  categoria TEXT NOT NULL,
  preu NUMERIC(10,2) NOT NULL,
  extres JSONB,
  disponibilitat BOOLEAN DEFAULT TRUE,
  imatge TEXT,
  descripcio TEXT
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  nom_client TEXT NOT NULL,
  num_taula INTEGER NOT NULL,
  estat TEXT NOT NULL DEFAULT 'pending', -- pending | preparing | completed | cancelled
  preu_total NUMERIC(10,2) NOT NULL,
  pagat BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  plat_id INTEGER REFERENCES plats(id),
  plat_nom TEXT NOT NULL, -- snapshot of the dish name at the time of the order
  quantitat INTEGER NOT NULL DEFAULT 1,
  preu_unitat NUMERIC(10,2) NOT NULL, -- snapshot of the price; never trust prices sent by the frontend
  extres JSONB
);
