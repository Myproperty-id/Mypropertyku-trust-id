import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  className?: string;
}

export function FavoriteButton({
  isFavorite,
  onToggle,
  size = 'md',
  variant = 'icon',
  className
}: FavoriteButtonProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  if (variant === 'button') {
    return (
      <Button
        variant={isFavorite ? 'default' : 'outline'}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
        className={cn(
          'gap-2',
          isFavorite && 'bg-red-500 hover:bg-red-600 text-white border-red-500',
          className
        )}
      >
        <Heart
          size={iconSizes[size]}
          className={cn(isFavorite && 'fill-current')}
        />
        {isFavorite ? 'Tersimpan' : 'Simpan'}
      </Button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        sizeClasses[size],
        'rounded-full flex items-center justify-center transition-all duration-200',
        'bg-white/90 hover:bg-white shadow-md hover:shadow-lg',
        'dark:bg-gray-800/90 dark:hover:bg-gray-800',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        className
      )}
      aria-label={isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'}
    >
      <Heart
        size={iconSizes[size]}
        className={cn(
          'transition-all duration-200',
          isFavorite
            ? 'fill-red-500 text-red-500'
            : 'text-gray-600 dark:text-gray-300 hover:text-red-500'
        )}
      />
    </button>
  );
}
