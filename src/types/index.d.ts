type Restaurant = {
  name: string;
  id: string;
  desc: string | null;
  city: string;
  rating: number | null;
  rating_count: number;
  category: string;
  images: string[];
  price_range: string;
  featured: any;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};

type Pagination = {
  page: number;
  limit: number;
};
