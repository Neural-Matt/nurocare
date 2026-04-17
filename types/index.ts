// ─── Auth & User ────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string | null;
  nrc: string | null;
  date_of_birth: string | null;
  gender: 'male' | 'female' | 'other' | null;
  phone: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

// ─── Insurance Plans ────────────────────────────────────────────────────────

export interface CoverageDetail {
  category: string;
  limit: string;
  description: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  coverage_details: CoverageDetail[];
  features: string[];
  is_active: boolean;
  color: string; // tailwind gradient class
  created_at: string;
}

// ─── Subscriptions ──────────────────────────────────────────────────────────

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending';

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string;
  policy_number: string;
  created_at: string;
  // Joined data
  plan?: Plan;
}

// ─── Claims ─────────────────────────────────────────────────────────────────

export type ClaimType = 'consultation' | 'medication' | 'lab' | 'hospitalization' | 'dental';
export type ClaimStatus = 'submitted' | 'reviewing' | 'approved' | 'rejected' | 'paid';

export interface Claim {
  id: string;
  user_id: string;
  subscription_id: string | null;
  member_id: string | null; // null = account holder, else family member id
  type: ClaimType;
  amount: number;
  status: ClaimStatus;
  notes: string | null;
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  subscription?: Subscription;
}

// ─── Drugs ──────────────────────────────────────────────────────────────────

export interface Drug {
  id: string;
  name: string;
  generic_name: string;
  usage: string;
  dosage: string;
  side_effects: string[];
  category: string;
  prescription_required: boolean;
}

// ─── Dashboard ──────────────────────────────────────────────────────────────

export interface DashboardData {
  profile: Profile | null;
  activeSubscription: Subscription | null;
  recentClaims: Claim[];
}

// ─── UI Helpers ─────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// ─── Facilities ──────────────────────────────────────────────────────────────

export type FacilityType = 'hospital' | 'clinic' | 'pharmacy';

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  address: string;
  phone: string;
  distance_km: number;
  covered: boolean;
  open_now: boolean;
  hours: string;
  services: string[];
  lat: number;
  lng: number;
  rating: number; // 1–5
}

// ─── Family Members ──────────────────────────────────────────────────────────

export type Relationship = 'spouse' | 'child' | 'parent' | 'sibling' | 'other';
export type Gender = 'male' | 'female' | 'other';

export interface FamilyMember {
  id: string;
  user_id: string;
  name: string;
  relationship: Relationship;
  date_of_birth: string;
  gender: Gender;
  plan_id: string | null;
  created_at: string;
}

// ─── Payments ────────────────────────────────────────────────────────────────

export type PaymentStatus = 'success' | 'failed' | 'pending' | 'refunded';
export type PaymentMethod = 'mtn_momo' | 'airtel_money' | 'card' | 'bank';

export interface PaymentRecord {
  id: string;
  user_id: string;
  subscription_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  reference: string;
  description: string;
  created_at: string;
}

// ─── Notifications ───────────────────────────────────────────────────────────

export type NotificationType = 'claim_update' | 'payment_reminder' | 'coverage_status' | 'general';

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  action_href?: string;
  created_at: string;
}

// ─── Telemedicine ────────────────────────────────────────────────────────────

export type DoctorSpecialty = 'general' | 'paediatrics' | 'dermatology' | 'mental_health' | 'gynaecology' | 'nutrition';
export type DoctorAvailability = 'available' | 'busy' | 'offline';

export interface Doctor {
  id: string;
  name: string;
  specialty: DoctorSpecialty;
  qualifications: string;
  experience_years: number;
  languages: string[];
  availability: DoctorAvailability;
  next_available?: string; // ISO time string e.g. "14:30"
  rating: number;
  consult_count: number;
  whatsapp_number: string;
  avatar_initials: string;
  avatar_color: string; // tailwind bg class
}
