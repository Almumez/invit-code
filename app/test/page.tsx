'use client';

import { useState } from 'react';
import { Select, SelectItem } from '@/components/ui/select';

export default function TestPage() {
  const [value, setValue] = useState('option1');

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">اختبار مكون Select من MUI</h1>
      
      <div className="w-64">
        <Select
          value={value}
          onChange={(newValue) => setValue(newValue)}
          placeholder="اختر خيارًا"
        >
          <SelectItem value="option1">الخيار الأول</SelectItem>
          <SelectItem value="option2">الخيار الثاني</SelectItem>
          <SelectItem value="option3">الخيار الثالث</SelectItem>
        </Select>
      </div>
      
      <div className="mt-4">
        <p>القيمة المحددة: {value}</p>
      </div>
    </div>
  );
} 