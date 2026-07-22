import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, ShieldCheck, Clock, PlusCircle } from 'lucide-react';

export default async function PetHealthRecordsPage({ params: _params }: { params: Promise<{ id: string }> }) {
  // Mock data for Phase 8 testing
  const records = [
    {
      id: 'rec1',
      date: '2025-10-15',
      title: 'Annual Core Vaccinations',
      provider: 'Dr. Priya Sharma (VCI-98765)',
      type: 'VACCINATION',
      notes: 'Administered DHPPi and Rabies. Next booster due in 12 months.',
      documentUrl: '#'
    },
    {
      id: 'rec2',
      date: '2025-08-02',
      title: 'Teleconsultation: Mild limping',
      provider: 'Dr. Vivek Kumar',
      type: 'CONSULTATION',
      notes: 'Advised 3 days rest and observation. No physical swelling noted. If not resolved, physical visit required.',
      documentUrl: null
    },
    {
      id: 'rec3',
      date: '2025-05-10',
      title: 'Grooming Report: Bath & Hygiene',
      provider: 'Aarav Patel',
      type: 'GROOMING_REPORT',
      notes: 'Coat in good condition. Mild tangles behind ears resolved. No parasites found.',
      documentUrl: '#'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pet Health & Service Records</h1>
          <p className="text-gray-500 mt-2">Manage medical history, grooming reports, and vaccination certificates.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Clock className="w-4 h-4 mr-2" /> Reminders
          </Button>
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" /> Upload Record
          </Button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 flex gap-3">
        <ShieldCheck className="w-6 h-6 text-yellow-600 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-yellow-800">Privacy & Data Ownership</h4>
          <p className="text-sm text-yellow-700 mt-1">
            You own these records. Veterinarians can add clinical notes after a consultation, which cannot be silently edited. You control who else can view these documents.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {records.map(record => (
          <div key={record.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex gap-6">
            <div className="flex flex-col items-center justify-start pt-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center
                ${record.type === 'VACCINATION' ? 'bg-green-100 text-green-600' : 
                  record.type === 'CONSULTATION' ? 'bg-blue-100 text-blue-600' : 
                  'bg-purple-100 text-purple-600'}`}>
                <FileText className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{record.date}</span>
                  <h3 className="text-lg font-semibold text-gray-900 mt-1">{record.title}</h3>
                  <p className="text-sm text-gray-600 font-medium">{record.provider}</p>
                </div>
                {record.documentUrl && (
                  <Button variant="outline" size="sm">
                    View Document
                  </Button>
                )}
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{record.notes}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
