import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PropertyTypeSelector } from "./PropertyTypeSelector";
import { EnergyClassSelector } from "./EnergyClassSelector";
import { FloorSelector } from "./FloorSelector";
import { PriceInput } from "./PriceInput";
import { HistoricalPricesInput } from "./HistoricalPricesInput";
import { PropertyType, EnergyClass, HeatingType } from "@/types/propertyTypes";
import UploadRegionSelector from "./UploadRegionSelector";
import { createNotificationsForAllUsers } from "@/utils/notifications";
import { neighborhoodBounds, generateRandomCoordinates } from "@/utils/neighborhoodCoordinates";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { format } from "date-fns";
import { Sun, Heater } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from "@/contexts/LanguageContext";

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZXRzaW1waWRpcyIsImEiOiJjbTdiMWs3cXgwYWswMmpzajBsMWVkc2NsIn0.olbj-NVEl2ySOOALVPok_Q';
mapboxgl.accessToken = MAPBOX_TOKEN;

export const UploadForm = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [propertyType, setPropertyType] = useState<PropertyType>(null);
  const [floor, setFloor] = useState<number | null>(null);
  const [energyClass, setEnergyClass] = useState<EnergyClass | null>(null);
  const [yearBuilt, setYearBuilt] = useState(1990);
  const [area, setArea] = useState(50);
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [heatingType, setHeatingType] = useState<HeatingType | null>(null);
  const [hasParking, setHasParking] = useState<boolean>(false);
  const [solarWaterHeater, setSolarWaterHeater] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [coordinates, setCoordinates] = useState<[number, number]>([23.7275, 37.9838]);
  const [historicalPrices, setHistoricalPrices] = useState([{ year: 2020, price: 250000 }]);
  const [address, setAddress] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<Array<{
    place_name: string;
    center: [number, number];
  }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [lng, setLng] = useState(coordinates[0].toString());
  const [lat, setLat] = useState(coordinates[1].toString());
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const listedDate = format(new Date(), 'yyyy-MM-dd');
  const [selectedRegion, setSelectedRegion] = useState<{ name: string; region: string; color: string } | null>(null);

  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the property.",
        variant: "destructive",
      });
      return false;
    }

    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description for the property.",
        variant: "destructive",
      });
      return false;
    }

    if (!price || price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
      return false;
    }

    if (!propertyType) {
      toast({
        title: "Error",
        description: "Please select a property type.",
        variant: "destructive",
      });
      return false;
    }

    if (!energyClass) {
      toast({
        title: "Error",
        description: "Please select an energy class.",
        variant: "destructive",
      });
      return false;
    }

    if (!selectedRegion) {
      toast({
        title: "Error",
        description: "Please select a neighborhood.",
        variant: "destructive",
      });
      return false;
    }

    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please provide an image URL or upload an image.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    setIsUploading(true);
    try {
      console.log("File selected:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      console.log("Attempting to upload file:", {
        fileName,
        bucket: 'property-images',
        fileType: file.type
      });

      const { data: bucketData, error: bucketError } = await supabase.storage
        .from('property-images')
        .list();

      if (bucketError) {
        console.error("Bucket access error:", bucketError.message);
        throw new Error(`Cannot access bucket: ${bucketError.message}`);
      }

      console.log("Bucket access verified", { bucketContents: bucketData });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error("Upload failed:", uploadError.message);
        throw new Error(uploadError.message);
      }

      if (!uploadData) {
        throw new Error("Upload failed: No data returned");
      }

      console.log("Upload successful:", {
        path: uploadData.path,
        fullResponse: uploadData
      });

      setImageUrl(fileName);

      const { data: urlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      console.log("Generated public URL:", {
        url: urlData?.publicUrl,
        fileName: fileName
      });

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    } catch (error) {
      console.error('Upload error:', error instanceof Error ? error.message : 'Unknown error');
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to upload a property.",
          variant: "destructive",
        });
        return;
      }

      const propertyData = {
        title,
        description,
        price,
        property_type: propertyType,
        floor,
        energy_class: energyClass,
        year_built: yearBuilt,
        area,
        bedrooms,
        bathrooms,
        heating_type: heatingType,
        parking: hasParking,
        solar_water_heater: solarWaterHeater,
        image_url: imageUrl,
        coordinates: `(${coordinates[0]},${coordinates[1]})`,
        user_id: user.id,
        historical_prices: historicalPrices,
        created_at: listedDate,
        neighborhood: selectedRegion.name,
        region: selectedRegion.region,
        address: address
      };

      console.log('Uploading property with data:', propertyData);

      const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select();

      if (error) {
        throw error;
      }

      console.log('Property uploaded successfully:', data);

      await createNotificationsForAllUsers({
        title: "New Property Added",
        message: `A new property "${title}" has been added to the listings`,
        type: "property_added",
        propertyTitle: title
      });

      toast({
        title: "Success",
        description: "Property uploaded successfully!",
      });

      navigate('/');
    } catch (error: any) {
      console.error("Error during property upload:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const getImagePreviewUrl = () => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http")) return imageUrl;
    
    const { data } = supabase.storage
      .from('property-images')
      .getPublicUrl(imageUrl);
      
    console.log("Preview URL generated:", data?.publicUrl);
    return data?.publicUrl || "";
  };

  useEffect(() => {
    if (map.current) return;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: coordinates,
        zoom: 12
      });

      map.current.on('move', () => {
        const center = map.current.getCenter();
        setLng(center.lng.toFixed(4));
        setLat(center.lat.toFixed(4));
        setCoordinates([parseFloat(center.lng.toFixed(4)), parseFloat(center.lat.toFixed(4))]);
      });

      map.current.on('click', async (e) => {
        const { lng, lat } = e.lngLat;
        setLng(lng.toFixed(4));
        setLat(lat.toFixed(4));
        setCoordinates([lng, lat]);

        if (marker.current) {
          marker.current.remove();
        }

        marker.current = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current);

        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
          );
          const data = await response.json();
          if (data.features?.length > 0) {
            setAddress(data.features[0].place_name);
          }
        } catch (error) {
          console.error('Error fetching address:', error);
        }
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Failed to initialize map. Please try refreshing the page.",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    if (selectedRegion && neighborhoodBounds[selectedRegion.region]?.[selectedRegion.name]) {
      const bounds = neighborhoodBounds[selectedRegion.region][selectedRegion.name];
      const newCoordinates = generateRandomCoordinates(bounds.center, bounds.radius);
      setCoordinates(newCoordinates);
      
      if (map.current) {
        map.current.setCenter(newCoordinates);
        if (marker.current) {
          marker.current.setLngLat(newCoordinates);
        } else {
          marker.current = new mapboxgl.Marker()
            .setLngLat(newCoordinates)
            .addTo(map.current);
        }
      }

      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${newCoordinates[0]},${newCoordinates[1]}.json?access_token=${mapboxgl.accessToken}`)
        .then(response => response.json())
        .then(data => {
          if (data.features?.length > 0) {
            setAddress(data.features[0].place_name);
          }
        });
    }
  }, [selectedRegion]);

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    
    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?proximity=${coordinates[0]},${coordinates[1]}&access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();
        setAddressSuggestions(data.features);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      }
    } else {
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectAddress = (suggestion: { place_name: string; center: [number, number] }) => {
    setAddress(suggestion.place_name);
    setCoordinates(suggestion.center);
    setShowSuggestions(false);
    
    if (map.current) {
      map.current.setCenter(suggestion.center);
      if (marker.current) {
        marker.current.setLngLat(suggestion.center);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">{t("Title")}</Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">{t("Description")}</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <PriceInput price={price} onPriceChange={setPrice} />

      <PropertyTypeSelector
        propertyType={propertyType}
        onPropertyTypeChange={setPropertyType}
      />

      {propertyType === 'apartment' && (
        <FloorSelector floor={floor} onFloorChange={setFloor} />
      )}

      <EnergyClassSelector
        energyClass={energyClass}
        onEnergyClassChange={setEnergyClass}
      />

      <div>
        <Label htmlFor="yearBuilt">{t("Year Built")}</Label>
        <Input
          type="number"
          id="yearBuilt"
          value={yearBuilt}
          onChange={(e) => setYearBuilt(parseInt(e.target.value))}
          required
        />
      </div>

      <div>
        <Label htmlFor="area">{t("Area (m²)")}</Label>
        <Input
          type="number"
          id="area"
          value={area}
          onChange={(e) => setArea(parseInt(e.target.value))}
          required
        />
      </div>

      <div>
        <Label htmlFor="bedrooms">{t("Bedrooms")}</Label>
        <Input
          type="number"
          id="bedrooms"
          value={bedrooms}
          onChange={(e) => setBedrooms(parseInt(e.target.value))}
          required
        />
      </div>

      <div>
        <Label htmlFor="bathrooms">{t("Bathrooms")}</Label>
        <Input
          type="number"
          id="bathrooms"
          value={bathrooms}
          onChange={(e) => setBathrooms(parseInt(e.target.value))}
          required
        />
      </div>

      {propertyType === 'apartment' && (
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <Heater className="w-4 h-4" />
            {t("Heating Type")}
          </Label>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={heatingType === 'central' ? 'default' : 'outline'}
              onClick={() => setHeatingType('central')}
              className="flex-1"
            >
              {t("Central")}
            </Button>
            <Button
              type="button"
              variant={heatingType === 'independent' ? 'default' : 'outline'}
              onClick={() => setHeatingType('independent')}
              className="flex-1"
            >
              {t("Independent")}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <Heater className="w-4 h-4 rotate-90" />
          {t("Parking Space")}
        </Label>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={hasParking ? 'default' : 'outline'}
            onClick={() => setHasParking(true)}
            className="flex-1"
          >
            {t("Yes")}
          </Button>
          <Button
            type="button"
            variant={!hasParking ? 'default' : 'outline'}
            onClick={() => setHasParking(false)}
            className="flex-1"
          >
            {t("No")}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <Sun className="w-4 h-4" />
          {t("Solar Water Heater")}
        </Label>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={solarWaterHeater ? 'default' : 'outline'}
            onClick={() => setSolarWaterHeater(true)}
            className="flex-1"
          >
            {t("Yes")}
          </Button>
          <Button
            type="button"
            variant={!solarWaterHeater ? 'default' : 'outline'}
            onClick={() => setSolarWaterHeater(false)}
            className="flex-1"
          >
            {t("No")}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <Sun className="w-4 h-4" />
          {t("Listed On")}
        </Label>
        <Input
          type="text"
          value={listedDate}
          readOnly
          className="bg-muted"
        />
      </div>

      <div className="space-y-4">
        <Label>{t("Property Image")}</Label>
        
        <div className="flex gap-4 mb-4">
          <Button
            type="button"
            variant={uploadMethod === 'url' ? 'default' : 'outline'}
            onClick={() => setUploadMethod('url')}
            className="flex-1"
          >
            {t("Image URL")}
          </Button>
          <Button
            type="button"
            variant={uploadMethod === 'file' ? 'default' : 'outline'}
            onClick={() => setUploadMethod('file')}
            className="flex-1"
          >
            {t("Upload File")}
          </Button>
        </div>

        {uploadMethod === 'url' ? (
          <div>
            <Input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder={t("Enter image URL")}
              className="mb-2"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="mb-2"
              disabled={isUploading}
            />
            {isUploading && (
              <div className="text-sm text-muted-foreground">
                {t("Uploading image...")}
              </div>
            )}
          </div>
        )}

        {imageUrl && (
          <div className="mt-4">
            <img
              src={getImagePreviewUrl()}
              alt="Property preview"
              className="max-w-full h-auto rounded-lg"
              onError={(e) => {
                console.error("Error loading preview image:", e);
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/placeholder.svg";
              }}
            />
          </div>
        )}
      </div>

      <HistoricalPricesInput
        currentPrice={price}
        historicalPrices={historicalPrices}
        onHistoricalPricesChange={setHistoricalPrices}
      />

      <UploadRegionSelector
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
      />

      <div className="relative">
        <Label htmlFor="address">{t("Address")}</Label>
        <Input
          type="text"
          id="address"
          value={address}
          onChange={handleAddressChange}
          placeholder={t("Enter property address")}
          className="mt-1"
        />
        {showSuggestions && addressSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
            {addressSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                onClick={() => selectAddress(suggestion)}
              >
                {suggestion.place_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={mapContainer} className="map-container h-[400px] rounded-lg overflow-hidden" />

      <Button type="submit">{t("Upload Property")}</Button>
    </form>
  );
};
