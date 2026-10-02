import React from 'react';

// Select
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ options, className = '', ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={`appearance-none w-full bg-white border border-ice-100 text-navy-900 rounded-base pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow shadow-sm ${className}`}
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-secundario">
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
    </div>
  </div>
));
Select.displayName = 'Select';

// MultiSelect (Simplified version native)
export const MultiSelect = React.forwardRef<HTMLSelectElement, SelectProps>(({ options, className = '', ...props }, ref) => (
  <select
    ref={ref}
    multiple
    className={`w-full bg-white border border-ice-100 text-navy-900 rounded-base p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-shadow shadow-sm ${className}`}
    {...props}
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value} className="py-1 px-2 checked:bg-sky-200 checked:text-navy-900 rounded">
        {opt.label}
      </option>
    ))}
  </select>
));
MultiSelect.displayName = 'MultiSelect';

// Slider
export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: number;
  onChangeValue: (val: number) => void;
}

export const Slider: React.FC<SliderProps> = ({ value, onChangeValue, min = 0, max = 100, className = '', ...props }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChangeValue(Number(e.target.value))}
        className="w-full h-2 bg-ice-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
        {...props}
      />
      <span className="text-sm font-bold text-navy-900 w-12 text-right tabular-figures">{value}</span>
    </div>
  );
};
