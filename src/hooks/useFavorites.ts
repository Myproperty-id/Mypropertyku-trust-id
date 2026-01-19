import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's favorites
  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data?.map(f => f.property_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Check if a property is favorited
  const isFavorite = useCallback((propertyId: string) => {
    return favorites.includes(propertyId);
  }, [favorites]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (propertyId: string) => {
    if (!user) {
      toast.error('Silakan login untuk menyimpan properti favorit');
      return false;
    }

    const isCurrentlyFavorite = isFavorite(propertyId);

    try {
      if (isCurrentlyFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);

        if (error) throw error;
        setFavorites(prev => prev.filter(id => id !== propertyId));
        toast.success('Properti dihapus dari favorit');
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, property_id: propertyId });

        if (error) throw error;
        setFavorites(prev => [...prev, propertyId]);
        toast.success('Properti disimpan ke favorit');
      }
      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Gagal memperbarui favorit');
      return false;
    }
  }, [user, isFavorite]);

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    refetch: fetchFavorites
  };
}
