
interface RegionMetricsProps {
  avgPrice: string;
  pricePerMeter: string;
  apartments: string;
  houses: string;
  apartmentsPercent: string;
  housesPercent: string;
  growth: string;
}

export const RegionMetrics = ({
  avgPrice,
  pricePerMeter,
  apartments,
  houses,
  apartmentsPercent,
  housesPercent,
  growth
}: RegionMetricsProps) => {
  return (
    <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <p className="text-sm text-gray-400 mb-1">Average Price</p>
        <p className="text-xl font-medium text-white">{avgPrice}</p>
        <p className="text-sm text-emerald-500">{growth}</p>
      </div>
      <div>
        <p className="text-sm text-gray-400 mb-1">Price per m²</p>
        <p className="text-xl font-medium text-white">{pricePerMeter}</p>
      </div>
      <div>
        <p className="text-sm text-gray-400 mb-1">Apartments</p>
        <p className="text-xl font-medium text-white">{apartments}</p>
        <p className="text-sm text-gray-400">{apartmentsPercent} of total</p>
      </div>
      <div>
        <p className="text-sm text-gray-400 mb-1">Houses</p>
        <p className="text-xl font-medium text-white">{houses}</p>
        <p className="text-sm text-gray-400">{housesPercent} of total</p>
      </div>
    </div>
  );
};
