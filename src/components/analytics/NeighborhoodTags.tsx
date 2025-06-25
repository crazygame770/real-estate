
interface NeighborhoodTagsProps {
  neighborhoods: Array<{ name: string }>;
  color: string;
}

const NeighborhoodTags = ({ neighborhoods, color }: NeighborhoodTagsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-6">
      {neighborhoods?.map((neighborhood) => (
        <span
          key={neighborhood.name}
          className="text-sm py-1 px-3 rounded"
          style={{ 
            backgroundColor: `${color}15`,
            color: color
          }}
        >
          {neighborhood.name}
        </span>
      ))}
    </div>
  );
};

export default NeighborhoodTags;
