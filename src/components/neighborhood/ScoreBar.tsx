
interface ScoreBarProps {
  value: number;
  color: string;
  updatedValue?: number;
}

export const ScoreBar = ({ value, color, updatedValue }: ScoreBarProps) => {
  const displayValue = updatedValue !== undefined ? updatedValue : value;
  const width = `${(displayValue / 10) * 100}%`;
  
  return (
    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden group-hover:bg-gray-200 transition-all duration-300">
      <div 
        className="h-full transition-all duration-300 rounded-full opacity-30 group-hover:opacity-80 group-focus-within:opacity-80"
        style={{ 
          width,
          backgroundColor: color
        }}
      />
    </div>
  );
};
