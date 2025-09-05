import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  createdAt: number;
}

interface ReviewsContextType {
  getReviews: (productId: string) => Review[];
  addReview: (productId: string, author: string, rating: number, comment: string) => Review;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const [reviewsByProduct, setReviewsByProduct] = useState<Record<string, Review[]>>({});

  const getReviews = (productId: string) => reviewsByProduct[productId] ?? [];

  const addReview = (productId: string, author: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: Math.random().toString(36).slice(2),
      productId,
      author: author.trim(),
      rating: Math.max(1, Math.min(5, Math.round(rating))),
      comment: comment.trim(),
      createdAt: Date.now(),
    };
    setReviewsByProduct((prev) => {
      const list = prev[productId] ?? [];
      return { ...prev, [productId]: [newReview, ...list] };
    });
    return newReview;
  };

  const value = useMemo(() => ({ getReviews, addReview }), [reviewsByProduct]);

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
};

export const useReviews = () => {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewsProvider');
  return ctx;
};
