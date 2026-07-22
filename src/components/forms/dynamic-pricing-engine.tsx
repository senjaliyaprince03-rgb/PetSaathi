"use client";

import React, { useMemo } from 'react';
import type { CoreServiceCode } from '@/modules/catalog/services';

interface DynamicPricingProps {
  serviceCode: CoreServiceCode;
  basePrice: number;
  assessmentData: Record<string, unknown>;
  petDetails: { size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE' };
}

export function DynamicPricingEngine({ serviceCode, basePrice, assessmentData, petDetails }: DynamicPricingProps) {
  
  const calculatedPrice = useMemo(() => {
    let finalPrice = basePrice;
    const breakdown = [{ label: 'Base Price', amount: basePrice }];

    if (serviceCode === 'GROOMING_HOME') {
      // Size multipliers
      if (petDetails.size === 'LARGE') {
        finalPrice += 200;
        breakdown.push({ label: 'Large Pet Surcharge', amount: 200 });
      } else if (petDetails.size === 'EXTRA_LARGE') {
        finalPrice += 400;
        breakdown.push({ label: 'Extra Large Pet Surcharge', amount: 400 });
      }

      // Condition multipliers
      if (assessmentData.coatCondition === 'MILD_TANGLES') {
        finalPrice += 150;
        breakdown.push({ label: 'Detangling Fee', amount: 150 });
      } else if (assessmentData.coatCondition === 'MATTED' || assessmentData.coatCondition === 'SEVERE_MATTED') {
        finalPrice += 500;
        breakdown.push({ label: 'Severe Matting Fee', amount: 500 });
      }

      if (assessmentData.parasites) {
        finalPrice += 300;
        breakdown.push({ label: 'Parasite-Control Bath Add-on', amount: 300 });
      }
    }

    return { total: finalPrice, breakdown };
  }, [serviceCode, basePrice, assessmentData, petDetails]);

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Dynamic Price Estimate</h4>
      <div className="space-y-2">
        {calculatedPrice.breakdown.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm text-gray-600">
            <span>{item.label}</span>
            <span>₹{item.amount}</span>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900">
          <span>Total Estimate</span>
          <span>₹{calculatedPrice.total}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          * Final price may vary if conditions found during the pre-service inspection differ from assessment.
        </p>
      </div>
    </div>
  );
}
