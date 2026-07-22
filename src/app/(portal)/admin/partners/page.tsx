import React from 'react';
import { Button } from '@/components/ui/button';
import type { PartnerProfile } from '@/lib/types/partner';

// Mock data for Phase 8 testing
const mockPartners: PartnerProfile[] = [
  {
    id: 'p1',
    userId: 'u1',
    firstName: 'Aarav',
    lastName: 'Patel',
    email: 'aarav.groomer@example.com',
    phone: '+919876543210',
    serviceCategories: ['GROOMING_HOME'],
    verificationLevel: 'SKILLS_ASSESSED',
    specialistBadges: ['CAT_GROOMING'],
    isVerified: true,
    bio: 'Professional pet groomer with 5 years experience.',
    rating: 4.8,
    completedBookings: 120,
    joinedAt: '2023-01-15'
  },
  {
    id: 'p2',
    userId: 'u2',
    firstName: 'Dr. Priya',
    lastName: 'Sharma',
    email: 'dr.priya@example.com',
    phone: '+919876543211',
    serviceCategories: ['VET_SUPPORT'],
    verificationLevel: 'SPECIALIST_APPROVED',
    specialistBadges: [],
    isVerified: true,
    registrationNumber: 'VCI-98765',
    stateCouncil: 'Gujarat Veterinary Council',
    bio: 'Licensed veterinarian focusing on preventive care.',
    rating: 4.9,
    completedBookings: 45,
    joinedAt: '2024-02-10'
  },
  {
    id: 'p3',
    userId: 'u3',
    firstName: 'Rohan',
    lastName: 'Desai',
    email: 'rohan.trainer@example.com',
    phone: '+919876543212',
    serviceCategories: ['TRAINING_ASSESSMENT'],
    verificationLevel: 'BACKGROUND_CHECKED',
    specialistBadges: [],
    isVerified: false,
    bio: 'Dog trainer specializing in reward-based puppy foundations.',
    rating: 0,
    completedBookings: 0,
    joinedAt: '2024-07-01'
  }
];

export default function AdminPartnersPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partner Verification & Registry</h1>
          <p className="text-gray-500 mt-2">Manage service partners for Grooming, Vet, and Training.</p>
        </div>
        <Button>Onboard New Partner</Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockPartners.map((partner) => (
              <tr key={partner.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {partner.firstName} {partner.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{partner.email}</div>
                      {partner.registrationNumber && (
                        <div className="text-xs text-blue-600 mt-1">Reg: {partner.registrationNumber}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-1 flex-wrap">
                    {partner.serviceCategories.map(cat => (
                      <span key={cat} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {cat}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {partner.verificationLevel.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {partner.isVerified ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending Approval
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4">Review</button>
                  <button className="text-red-600 hover:text-red-900">Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
