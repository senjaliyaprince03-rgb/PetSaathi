"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  LoaderCircle, 
  Send, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles,
  HelpCircle,
  Home,
  Users,
  Briefcase,
  AlertTriangle
} from "lucide-react";

import { Button } from "@/components/ui/button";

const topics = [
  { value: "BOOKING_HELP", label: "Booking Help", icon: HelpCircle, desc: "Schedules, packages & caregiver match" },
  { value: "SOCIETY", label: "Society Partnership", icon: Building2, desc: "Gated community & RWA onboardings" },
  { value: "SITTER_INTEREST", label: "Become a Saathi", icon: Users, desc: "Caregiver certification & applications" },
  { value: "BOARDING_PILOT", label: "Boarding Pilot", icon: Home, desc: "Home boarding pilot waitlist" },
  { value: "PARTNER", label: "Service Partner", icon: Briefcase, desc: "Veterinary, grooming & corporate" },
  { value: "SAFETY", label: "Safety Concern", icon: AlertTriangle, desc: "Priority trust & safety triage" },
  { value: "GENERAL", label: "General Inquiry", icon: Sparkles, desc: "Other queries & questions" }
] as const;

export function ContactForm({ defaultTopic = "GENERAL" }: { defaultTopic?: string }) {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [topic, setTopic] = useState(
    topics.some((t) => t.value === defaultTopic) ? defaultTopic : "GENERAL"
  );
  const [messageLength, setMessageLength] = useState(0);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const data = new FormData(event.currentTarget);

    const payload = {
      type: topic,
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      organisationName: data.get("organisationName"),
      locality: data.get("locality"),
      message: data.get("message"),
      consentToContact: data.get("consentToContact") === "on",
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as {
        error?: string;
        lead?: { id: string };
      } | null;

      setPending(false);

      if (!response.ok) {
        if (result?.error === "lead_capture_not_configured") {
          return setError("The enquiry service is temporarily unavailable. Please email us directly at support@petsaathi.com.");
        }
        if (result?.error === "too_many_requests") {
          return setError("Too many messages submitted from this network. Please try again shortly or call our hotline.");
        }
        return setError("Please check the fields: a valid name, email or 10-digit Indian mobile, and a descriptive message (20+ chars) are required.");
      }

      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: topic,
          currency: "INR",
        });
      }

      if (result?.lead?.id) {
        setLeadId(result.lead.id.slice(-6).toUpperCase());
      }
      setSent(true);
    } catch {
      setPending(false);
      setError("Network connection issue. Please check your internet connection or email us at support@petsaathi.com.");
    }
  }

  if (sent) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-leaf/30 bg-gradient-to-br from-paper to-leaf/5 p-8 text-center shadow-xl sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-leaf/10 text-leaf">
          <CheckCircle2 className="h-9 w-9 animate-in zoom-in" />
        </div>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-leaf/30 bg-leaf/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-leaf">
          Enquiry Successfully Logged
        </span>
        <h3 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">
          Thank you! We have received your message.
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/75 sm:text-base">
          Our Care Concierge team has received your message and will review it promptly. You will receive an acknowledgment via email or WhatsApp within <strong className="text-ink">2–4 business hours</strong>.
        </p>

        {leadId && (
          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-xl border border-ink/10 bg-white/80 px-4 py-2 text-xs font-semibold text-ink/70">
            <span>Reference ID:</span>
            <span className="font-mono font-bold text-indigo">PS-REF-{leadId}</span>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setLeadId(null);
            }}
            className="rounded-xl border border-ink/20 bg-white px-5 py-2.5 text-xs font-bold text-ink shadow-sm transition hover:bg-paper"
          >
            Submit Another Message
          </button>
          <a
            href="/"
            className="rounded-xl bg-indigo px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo/90"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  const selectedTopicObj = topics.find((t) => t.value === topic) || topics[0];

  return (
    <div className="rounded-3xl border border-indigo/10 bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-9 md:p-10">
      <div className="mb-6 border-b border-ink/10 pb-5 sm:mb-8">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-leaf animate-pulse" />
          <span className="text-[0.7rem] font-bold uppercase tracking-widest text-indigo">
            Care Concierge Dispatch
          </span>
        </div>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
          Send a Direct Message
        </h2>
        <p className="mt-1.5 text-xs text-ink/70 sm:text-sm">
          Please select the category that best matches your request for immediate routing to the right specialist.
        </p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-6">
        {/* Topic Selector Pills */}
        <div>
          <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-ink/80">
            Select Enquiry Topic <span className="text-coral">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3">
            {topics.map((t) => {
              const Icon = t.icon;
              const isSelected = topic === t.value;
              return (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => setTopic(t.value)}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-indigo bg-indigo/10 text-indigo shadow-xs ring-1 ring-indigo/30"
                      : "border-ink/10 bg-surface/50 text-ink/75 hover:border-ink/25 hover:bg-surface"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-indigo" : "text-ink/50"}`} />
                  <span className="text-xs font-bold leading-tight truncate">{t.label}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[0.72rem] text-ink/55">
            Active topic: <span className="font-semibold text-ink/80">{selectedTopicObj.desc}</span>
          </p>
        </div>

        {/* Input Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field 
            label="Your Full Name" 
            name="name" 
            required 
            placeholder="e.g. Radhika Sharma"
            icon={<User className="h-4 w-4 text-ink/40" />} 
          />
          <Field 
            label="Email Address" 
            name="email" 
            type="email" 
            placeholder="radhika@example.com"
            icon={<Mail className="h-4 w-4 text-ink/40" />} 
          />
          <Field 
            label="Indian Mobile Number" 
            name="phone" 
            inputMode="numeric" 
            maxLength={10} 
            placeholder="10-digit number (e.g. 9876543210)"
            icon={<Phone className="h-4 w-4 text-ink/40" />} 
          />
          <Field 
            label={topic === "SOCIETY" ? "Society / Apartment Name *" : "Society or Organisation"} 
            name="organisationName" 
            required={topic === "SOCIETY"} 
            placeholder={topic === "SOCIETY" ? "e.g. Prestige Shantiniketan" : "Optional"}
            icon={<Building2 className="h-4 w-4 text-ink/40" />} 
          />
        </div>

        <Field 
          label="Locality / City" 
          name="locality" 
          placeholder="e.g. Whitefield, Bengaluru or Powai, Mumbai"
          icon={<MapPin className="h-4 w-4 text-ink/40" />} 
        />

        {/* Message Field */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-wider text-ink/80">
              Your Message <span className="text-coral">*</span>
            </label>
            <span className={`text-[0.7rem] font-medium ${messageLength < 20 ? "text-coral font-bold" : "text-ink/50"}`}>
              {messageLength} / 2000 chars (min 20)
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-3.5 pointer-events-none text-ink/40">
              <MessageSquare className="h-4 w-4" />
            </span>
            <textarea
              id="contact-message"
              aria-label="Your Message"
              name="message"
              required
              minLength={20}
              maxLength={2000}
              onChange={(e) => setMessageLength(e.target.value.length)}
              className="min-h-32 w-full rounded-2xl border border-ink/15 bg-paper/60 pl-10 pr-4 pt-3 pb-3 text-sm text-ink outline-none transition focus:border-indigo focus:bg-white focus:ring-2 focus:ring-indigo/20 placeholder:text-ink/40"
              placeholder="Please share details such as your pet's breed/age, dates, society location, or any specific care requirements."
            />
          </div>
        </div>

        {/* Consent Checkbox */}
        <label htmlFor="consentToContact" className="group flex items-start gap-3 text-xs leading-relaxed text-ink/75 cursor-pointer">
          <input
            id="consentToContact"
            aria-label="Consent to contact"
            name="consentToContact"
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/20 accent-indigo transition cursor-pointer"
          />
          <span>
            I consent to PetSaathi contacting me regarding this specific enquiry via email, call, or WhatsApp. (We value your privacy and never share your data.)
          </span>
        </label>

        {error && (
          <div className="rounded-2xl border border-coral/20 bg-coral/10 p-3.5 text-xs font-semibold text-coral" role="alert">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="accent"
          size="lg"
          className="w-full h-12 rounded-xl font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
          disabled={pending}
        >
          {pending ? (
            <span className="flex items-center gap-2">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Routing to Concierge...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Submit Enquiry Securely
            </span>
          )}
        </Button>

        <div className="flex items-center justify-center gap-4 text-[0.7rem] text-ink/50 pt-1">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-leaf" /> 256-Bit SSL Encrypted
          </span>
          <span>•</span>
          <span>Zero Spam Guarantee</span>
          <span>•</span>
          <span>Senior Care Lead Assigned</span>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  inputMode,
  maxLength,
  placeholder,
  icon
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  inputMode?: "numeric";
  maxLength?: number;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label htmlFor={name} className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/80">
        {label} {required && <span className="text-coral">*</span>}
      </span>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink/40">
            {icon}
          </span>
        )}
        <input
          id={name}
          aria-label={label}
          name={name}
          type={type}
          required={required}
          inputMode={inputMode}
          maxLength={maxLength}
          placeholder={placeholder}
          className={`h-11 w-full rounded-xl border border-ink/15 bg-paper/60 text-sm text-ink outline-none transition focus:border-indigo focus:bg-white focus:ring-2 focus:ring-indigo/20 placeholder:text-ink/40 ${
            icon ? "pl-10 pr-3.5" : "px-3.5"
          }`}
        />
      </div>
    </label>
  );
}
