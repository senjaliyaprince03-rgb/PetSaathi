import Link from "next/link";
import { Building, Heart, Shield, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default function CorporateBenefitsPage() {
  return (
    <div className="container-shell mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 bg-blue-50 rounded-2xl mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Pet Care Benefits for Modern Teams</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Attract and retain top talent by offering comprehensive pet care benefits. Show your employees you care about their whole family, furry members included.
        </p>
        <Link href="#contact" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Partner With Us
        </Link>
      </section>

      {/* Problem & Solution */}
      <section className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">The Challenge</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            As remote and hybrid work becomes the norm, pet ownership has surged among professionals. Finding reliable, trusted pet care during work trips, long office days, or emergencies is a significant stressor for employees, impacting their productivity and well-being.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">The PetSaathi Solution</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            PetSaathi partners with enterprises to provide subsidized, on-demand, and premium pet care services. From verified pet sitters to emergency boarding, we ensure your employees have peace of mind while they focus on work.
          </p>
        </div>
      </section>

      {/* Supported Services */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">What We Offer</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-paper p-6 rounded-xl shadow text-center">
            <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Subsidized Pet Sitting</h3>
            <p className="text-gray-600">Company-sponsored credits for daily pet sitting and dog walking services.</p>
          </div>
          <div className="bg-paper p-6 rounded-xl shadow text-center">
            <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Emergency Boarding</h3>
            <p className="text-gray-600">Priority access to trusted boarding facilities during unexpected business travel.</p>
          </div>
          <div className="bg-paper p-6 rounded-xl shadow text-center">
            <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Dedicated Concierge</h3>
            <p className="text-gray-600">A personalized support channel to handle employee requests and last-minute bookings.</p>
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section id="contact" className="bg-gray-900 text-white p-12 rounded-2xl text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Enhance Your Benefits?</h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          Join leading companies in providing the most sought-after lifestyle benefit. Our partner team will help you design a program that fits your company&apos;s size and budget.
        </p>
        <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
          Contact Sales Team
        </button>
      </section>
    </div>
  );
}
