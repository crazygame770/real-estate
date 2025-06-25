
import { supabase } from "@/integrations/supabase/client";

export const uploadProfilePicture = async (userId: string, profilePicture: File) => {
  const fileExt = profilePicture.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  // Check if bucket exists, create if it doesn't
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(bucket => bucket.name === 'profile_pictures')) {
    const { error: bucketError } = await supabase.storage.createBucket('profile_pictures', {
      public: true,
      fileSizeLimit: 1024 * 1024 * 2 // 2MB limit
    });
    if (bucketError) throw bucketError;
  }

  const { error: uploadError, data } = await supabase.storage
    .from('profile_pictures')
    .upload(fileName, profilePicture);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('profile_pictures')
    .getPublicUrl(fileName);

  return publicUrl;
};

export const checkExistingUser = async (email: string, username?: string, phone?: string) => {
  // Check if email exists in auth.users (this is handled by Supabase automatically)
  
  if (username) {
    const { data: existingUserWithUsername, error: usernameError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (usernameError) throw usernameError;
    if (existingUserWithUsername) {
      throw new Error("This username is already taken");
    }
  }

  if (phone) {
    const { data: existingUserWithPhone, error: phoneError } = await supabase
      .from('profiles')
      .select('phone')
      .eq('phone', phone)
      .maybeSingle();

    if (phoneError) throw phoneError;
    if (existingUserWithPhone) {
      throw new Error("This phone number is already registered");
    }
  }
};

export const updateUserProfile = async (userId: string, profilePictureUrl: string | null) => {
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ 
      profile_picture_url: profilePictureUrl,
    })
    .eq('id', userId);

  if (updateError) throw updateError;
};

export const getUserRole = async (userId: string) => {
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) throw profileError;
  return profileData?.role;
};
