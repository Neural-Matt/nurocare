-- =====================================================
-- Adds facilities, drugs, and doctors as real backend
-- tables (previously the app only ever read hardcoded
-- mock arrays for these, regardless of config).
-- Safe to re-run (idempotent, including seed data).
-- =====================================================

create table if not exists public.facilities (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  type         text not null check (type in ('hospital', 'clinic', 'pharmacy')),
  address      text not null,
  phone        text not null,
  distance_km  numeric(5,1),
  covered      boolean not null default false,
  open_now     boolean not null default true,
  hours        text,
  services     text[] default '{}',
  lat          numeric(9,6) not null,
  lng          numeric(9,6) not null,
  rating       numeric(2,1),
  created_at   timestamptz not null default now()
);

create table if not exists public.drugs (
  id                     uuid primary key default uuid_generate_v4(),
  name                   text not null,
  generic_name           text not null,
  usage_description      text not null,
  dosage                 text not null,
  side_effects           text[] default '{}',
  category               text not null,
  prescription_required  boolean not null default false,
  created_at             timestamptz not null default now()
);

create table if not exists public.doctors (
  id                uuid primary key default uuid_generate_v4(),
  name              text not null,
  specialty         text not null
                      check (specialty in ('general','paediatrics','dermatology','mental_health','gynaecology','nutrition')),
  qualifications    text,
  experience_years  int not null default 0,
  languages         text[] default '{}',
  availability      text not null default 'offline' check (availability in ('available','busy','offline')),
  next_available    text,
  rating            numeric(2,1),
  consult_count     int not null default 0,
  whatsapp_number   text not null,
  avatar_initials   text not null,
  avatar_color      text not null default 'bg-primary-500',
  created_at        timestamptz not null default now()
);

alter table public.facilities enable row level security;
alter table public.drugs      enable row level security;
alter table public.doctors    enable row level security;

drop policy if exists "Public can read facilities" on public.facilities;
create policy "Public can read facilities"
  on public.facilities for select using (true);

drop policy if exists "Public can read drugs" on public.drugs;
create policy "Public can read drugs"
  on public.drugs for select using (true);

drop policy if exists "Public can read doctors" on public.doctors;
create policy "Public can read doctors"
  on public.doctors for select using (true);

do $$
begin
  if not exists (select 1 from public.facilities) then
    insert into public.facilities (name, type, address, phone, distance_km, covered, open_now, hours, services, lat, lng, rating) values
    ('University Teaching Hospital', 'hospital', 'Nationalist Road, Lusaka', '+260 211 254 131', 1.2, true, true, 'Open 24 hours', array['Emergency','Surgery','Maternity','Paediatrics','ICU','Radiology'], -15.4117, 28.2996, 4.1),
    ('Maina Soko Military Hospital', 'hospital', 'Leopards Hill Road, Lusaka', '+260 211 273 044', 3.8, true, true, 'Open 24 hours', array['Emergency','Orthopaedics','Surgery','General Medicine'], -15.3880, 28.3320, 3.9),
    ('Levy Mwanawasa General Hospital', 'hospital', 'Church Road, Lusaka', '+260 211 222 821', 2.1, false, true, 'Open 24 hours', array['Emergency','Maternity','Paediatrics','General Medicine'], -15.4234, 28.2785, 3.7),
    ('Lusaka Trust Hospital', 'hospital', '2 Paseli Road, Northmead, Lusaka', '+260 211 234 567', 4.5, true, false, 'Mon–Sat 07:00–22:00', array['Outpatient','Surgery','Oncology','Cardiology','Dental'], -15.3970, 28.3150, 4.4),
    ('Care for Business Clinic', 'clinic', 'Cairo Road, Lusaka CBD', '+260 211 226 065', 0.7, true, true, 'Mon–Fri 08:00–17:00', array['GP Consultations','Blood Tests','Vaccinations','Occupational Health'], -15.4165, 28.2831, 4.6),
    ('Crossroads Medical Centre', 'clinic', 'Crossroads, Woodlands, Lusaka', '+260 211 262 099', 5.3, true, true, 'Daily 07:30–21:00', array['GP','Specialist Referrals','Ultrasound','Minor Surgery'], -15.4410, 28.3220, 4.3),
    ('Avic International Health Centre', 'clinic', 'East Park Mall, Thabo Mbeki Road', '+260 960 000 099', 3.2, false, true, 'Mon–Sat 08:00–20:00', array['GP Consultations','Dental','Eye Tests','Pharmacy'], -15.4070, 28.3340, 4.2),
    ('Chainama Hills Health Centre', 'clinic', 'Chainama Hills, Lusaka East', '+260 211 276 510', 7.1, true, false, 'Mon–Fri 08:00–16:30', array['Mental Health','GP','Counselling','Psychiatry'], -15.3730, 28.3560, 3.8),
    ('Zambia Pharmacy (Cairo Road)', 'pharmacy', 'Cairo Road, Central Lusaka', '+260 211 226 500', 0.4, true, true, 'Mon–Sat 08:00–18:00', array['Prescription Dispensing','OTC Medicines','Health Advice'], -15.4160, 28.2840, 4.0),
    ('Clicks Pharmacy — Manda Hill', 'pharmacy', 'Manda Hill Mall, Great East Road', '+260 211 257 888', 2.9, true, true, 'Daily 08:00–21:00', array['Prescription Drugs','Baby & Mother','Cosmetics','Health Monitoring'], -15.3985, 28.3240, 4.5),
    ('Pep Pharmacy — Arcades', 'pharmacy', 'Arcades Shopping Centre, Great East Road', '+260 211 290 100', 4.1, false, true, 'Daily 09:00–20:00', array['OTC Medicines','Vitamins & Supplements','Prescription Dispensing'], -15.3920, 28.3410, 3.9),
    ('HealthPlus Pharmacy — Kabulonga', 'pharmacy', 'Kabulonga Road, Lusaka', '+260 976 543 210', 6.0, true, false, 'Mon–Sat 08:00–19:00', array['24hr Emergency Dispensing','Chronic Medication','Health Screening'], -15.4450, 28.3080, 4.7);
  end if;

  if not exists (select 1 from public.drugs) then
    insert into public.drugs (name, generic_name, usage_description, dosage, side_effects, category, prescription_required) values
    ('Paracetamol', 'Acetaminophen', 'Relief of mild to moderate pain and fever reduction', 'Adults: 500mg–1g every 4–6 hours (max 4g/day). Children: 15mg/kg every 4–6 hours.', array['Nausea','Rash (rare)','Liver damage (overdose)'], 'Analgesic / Antipyretic', false),
    ('Amoxicillin', 'Amoxicillin trihydrate', 'Treatment of bacterial infections (respiratory, urinary, skin)', 'Adults: 250–500mg every 8 hours for 5–10 days as directed.', array['Diarrhea','Rash','Nausea','Allergic reaction'], 'Antibiotic', true),
    ('Metformin', 'Metformin hydrochloride', 'Management of type 2 diabetes mellitus', 'Starting dose: 500mg twice daily with meals. Max: 2000–2550mg/day.', array['Nausea','Diarrhea','Stomach upset','Lactic acidosis (rare)'], 'Antidiabetic', true),
    ('Lisinopril', 'Lisinopril', 'Treatment of high blood pressure and heart failure', 'Adults: 10mg once daily, may increase to 40mg/day.', array['Dry cough','Dizziness','Headache','Hyperkalemia'], 'ACE Inhibitor', true),
    ('Ibuprofen', 'Ibuprofen', 'Relief of pain, fever, and inflammation', 'Adults: 200–400mg every 4–6 hours (max 1200mg/day OTC).', array['Stomach upset','Heartburn','Dizziness','Kidney issues (long-term)'], 'NSAID', false),
    ('Atorvastatin', 'Atorvastatin calcium', 'Lowering cholesterol and reducing risk of cardiovascular disease', 'Adults: 10–80mg once daily, usually taken in the evening.', array['Muscle pain','Liver enzyme elevation','Headache','Nausea'], 'Statin', true),
    ('Artemether/Lumefantrine', 'Artemether + Lumefantrine', 'Treatment of uncomplicated malaria caused by Plasmodium falciparum', '6 doses over 3 days. Weight-based dosing for children.', array['Headache','Dizziness','Loss of appetite','Joint pain'], 'Antimalarial', true),
    ('Omeprazole', 'Omeprazole', 'Treatment of acid reflux, peptic ulcers, and GERD', 'Adults: 20–40mg once daily before breakfast.', array['Headache','Diarrhea','Nausea','Abdominal pain'], 'Proton Pump Inhibitor', false);
  end if;

  if not exists (select 1 from public.doctors) then
    insert into public.doctors (name, specialty, qualifications, experience_years, languages, availability, next_available, rating, consult_count, whatsapp_number, avatar_initials, avatar_color) values
    ('Dr. Chanda Mwila', 'general', 'MBChB, UNZA', 8, array['English','Bemba','Nyanja'], 'available', null, 4.8, 312, '260971000001', 'CM', 'bg-accent-500'),
    ('Dr. Nkandu Banda', 'paediatrics', 'MBChB, DCH', 12, array['English','Nyanja'], 'busy', '14:30', 4.9, 541, '260971000002', 'NB', 'bg-blue-500'),
    ('Dr. Mutinta Phiri', 'mental_health', 'MBChB, MRCPsych', 6, array['English','Tonga'], 'available', null, 4.7, 198, '260971000003', 'MP', 'bg-violet-500'),
    ('Dr. Abel Sinkala', 'dermatology', 'MBChB, Dip Derm', 10, array['English','Bemba'], 'offline', 'Tomorrow 09:00', 4.6, 267, '260971000004', 'AS', 'bg-warning-500'),
    ('Dr. Charity Tembo', 'gynaecology', 'MBChB, MRCOG', 15, array['English','Nyanja','Bemba'], 'available', null, 4.9, 723, '260971000005', 'CT', 'bg-rose-500');
  end if;
end $$;
