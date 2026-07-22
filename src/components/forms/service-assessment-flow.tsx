"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { CoreServiceCode } from '@/modules/catalog/services';

interface ServiceAssessmentProps {
  serviceCode: CoreServiceCode;
  onComplete: (data: Record<string, unknown>) => void;
  onEmergency: () => void;
}

export function ServiceAssessmentFlow({ serviceCode, onComplete, onEmergency }: ServiceAssessmentProps) {
  const [data, setData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (serviceCode !== 'VET_SUPPORT' && serviceCode !== 'GROOMING_HOME' && serviceCode !== 'TRAINING_ASSESSMENT' && serviceCode !== 'PET_TAXI') {
      onComplete({});
    }
  }, [serviceCode, onComplete]);

  if (serviceCode === 'VET_SUPPORT') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Emergency Red Flag Check</h3>
        <p className="mb-4 text-sm text-gray-600">Please answer honestly. We do not provide AI diagnosis. If this is an emergency, we will route you to a physical clinic immediately.</p>
        
        <div className="space-y-3">
          <p className="font-medium text-gray-800">Is your pet experiencing any of the following?</p>
          <ul className="list-disc pl-5 text-sm text-gray-600 mb-4 space-y-1">
            <li>Difficulty breathing or choking</li>
            <li>Collapse, loss of consciousness, or seizures</li>
            <li>Severe or uncontrolled bleeding</li>
            <li>Inability to urinate</li>
          </ul>
          
          <div className="flex gap-4">
            <Button variant="primary" className="bg-coral text-white" onClick={onEmergency}>Yes, this is an emergency</Button>
            <Button variant="outline" onClick={() => onComplete({ isEmergency: false })}>No, none of these</Button>
          </div>
        </div>
      </div>
    );
  }

  if (serviceCode === 'GROOMING_HOME') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Pre-Grooming Assessment</h3>
        <p className="mb-4 text-sm text-gray-600">Help us match you with the right groomer and package.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coat Condition</label>
            <select 
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              onChange={(e) => setData({ ...data, coatCondition: e.target.value })}
            >
              <option value="">Select condition...</option>
              <option value="NORMAL">Maintained / Normal</option>
              <option value="MILD_TANGLES">Mildly Tangled</option>
              <option value="MATTED">Matted (Requires extra time)</option>
              <option value="SEVERE_MATTED">Severely Matted (May require vet approval)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tick/Flea Check</label>
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="parasites" onChange={() => setData({ ...data, parasites: true })} /> Yes, visible ticks/fleas
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="parasites" onChange={() => setData({ ...data, parasites: false })} /> No visible parasites
              </label>
            </div>
            {Boolean(data.parasites) && (
              <p className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                Note: Groomers do not diagnose or prescribe medication. We will provide a Parasite-Control bath using approved OTC products. Severe cases must be referred to a vet.
              </p>
            )}
          </div>
          
          <Button onClick={() => onComplete(data)} disabled={!data.coatCondition || data.parasites === undefined}>Continue</Button>
        </div>
      </div>
    );
  }


  if (serviceCode === 'TRAINING_ASSESSMENT') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Training Assessment Goal</h3>
        <p className="mb-4 text-sm text-gray-600">What is the primary behavior you want to address?</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Issue</label>
            <select 
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              onChange={(e) => setData({ ...data, primaryIssue: e.target.value })}
            >
              <option value="">Select issue...</option>
              <option value="OBEDIENCE">Basic Obedience</option>
              <option value="LEASH_PULLING">Leash Pulling</option>
              <option value="SEPARATION_ANXIETY">Separation Anxiety</option>
              <option value="AGGRESSION">Aggression / Reactivity (Requires Specialist)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bite History</label>
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="biteHistory" onChange={() => setData({ ...data, biteHistory: true })} /> Yes
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="biteHistory" onChange={() => setData({ ...data, biteHistory: false })} /> No
              </label>
            </div>
            {Boolean(data.biteHistory) && (
              <p className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                Note: Cases with bite history require a certified canine behaviorist. Standard trainers cannot be assigned.
              </p>
            )}
          </div>
          
          <Button onClick={() => onComplete(data)} disabled={!data.primaryIssue || data.biteHistory === undefined}>Continue</Button>
        </div>
      </div>
    );
  }

  if (serviceCode === 'PET_TAXI') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Pet Taxi Request</h3>
        <p className="mb-4 text-sm text-gray-600">Pet taxi is currently in beta. Please provide transport details.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Accompaniment</label>
            <select 
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              onChange={(e) => setData({ ...data, accompaniment: e.target.value })}
            >
              <option value="">Select accompaniment...</option>
              <option value="OWNER">Owner accompanied (Standard)</option>
              <option value="HANDLER">Handler required (Additional fee)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Carrier / Restraint</label>
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="carrier" onChange={() => setData({ ...data, hasCarrier: true })} /> Have own crate/carrier
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="carrier" onChange={() => setData({ ...data, hasCarrier: false })} /> Require harness/restraint
              </label>
            </div>
          </div>
          
          <Button onClick={() => onComplete(data)} disabled={!data.accompaniment || data.hasCarrier === undefined}>Continue</Button>
        </div>
      </div>
    );
  }

  return null;
}
