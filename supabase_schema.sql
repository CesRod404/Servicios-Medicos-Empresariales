-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para roles
CREATE TYPE user_role AS ENUM ('admin', 'doctor');

-- Tabla Profiles (Vinculada a auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    role user_role DEFAULT 'doctor',
    full_name TEXT
);

-- Habilitar RLS en profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'doctor');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Tabla `companies`
CREATE TABLE companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla `patients` (Empleados)
CREATE TABLE patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    full_name TEXT NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Por llegar' NOT NULL,
    payment_status BOOLEAN DEFAULT false,
    appointment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla `exams`
CREATE TABLE exams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    default_price NUMERIC(10,2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla `patient_exams`
CREATE TABLE patient_exams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    price_charged NUMERIC(10,2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS para Companies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all authenticated users" ON companies FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for admin only" ON companies FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND role = 'admin'));
CREATE POLICY "Enable update for admin only" ON companies FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND role = 'admin'));
CREATE POLICY "Enable delete for admin only" ON companies FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND role = 'admin'));

-- RLS para Patients
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read/write for all authenticated users" ON patients FOR ALL USING (auth.role() = 'authenticated');

-- RLS para Exams
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read/write for all authenticated users" ON exams FOR ALL USING (auth.role() = 'authenticated');

-- RLS para Patient_exams
ALTER TABLE patient_exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read/write for all authenticated users" ON patient_exams FOR ALL USING (auth.role() = 'authenticated');
