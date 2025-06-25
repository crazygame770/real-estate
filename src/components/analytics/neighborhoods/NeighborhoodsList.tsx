
interface NeighborhoodsListProps {
  neighborhoods: string[];
  color: string;
}

export const NeighborhoodsList = ({ neighborhoods, color }: NeighborhoodsListProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {neighborhoods.map((neighborhood) => (
        <span
          key={neighborhood}
          className="text-sm py-1 px-3 rounded transition-colors duration-200"
          style={{ 
            color: color,
            backgroundColor: `${color}15`
          }}
        >
          {neighborhood}
        </span>
      ))}
    </div>
  );
};
