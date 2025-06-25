
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface PropertyHeaderProps {
  image: string;
  price: string;
  title: string;
}

export const PropertyHeader = ({ image, price, title }: PropertyHeaderProps) => {
  const navigate = useNavigate();
  
  console.log("Raw image value:", image);

  const getImageUrl = () => {
    if (!image) {
      console.log("No image provided, using placeholder");
      return "/placeholder.svg";
    }
    
    // If it's a complete URL, use it directly
    if (image.startsWith("http")) {
      console.log("Using direct URL:", image);
      return image;
    }
    
    // If it's a filename, generate the Supabase URL
    const { data } = supabase.storage
      .from('property-images')
      .getPublicUrl(image);
      
    console.log("Generated Supabase URL:", data?.publicUrl);
    return data?.publicUrl || "/placeholder.svg";
  };

  const imageUrl = getImageUrl();
  console.log("Final image URL being used:", imageUrl);

  return (
    <div className="space-y-6 w-full">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to main menu
      </button>

      <div className="rounded-lg overflow-hidden h-[400px] w-full bg-gray-100 relative">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error("Error loading image:", e);
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "/placeholder.svg";
          }}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-3xl font-bold text-primary">{price}</p>
      </div>
    </div>
  );
};
