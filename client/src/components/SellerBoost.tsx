import React from "react";
import { useState } from "react";
import { TrendingUp, Star, Users, Package, ChevronRight, Award, Zap } from "lucide-react";
import { Link } from "wouter";

interface NewSeller {
  id: number;
  name: string;
  shopName: string;
  category: string;
  location: string;
  joinedDaysAgo: number;
  rating: number;
  totalSales: number;
  Icon: React.ElementType;
  badge: string;
  featuredProduct: string;
  featuredPrice: string;
  isNew: boolean;
}

const NEW_SELLERS: NewSeller[] = [
  {
    id: 1,
    name: "Umm Ibrahim",
    shopName: "Barakah Bakes",
    category: "Halal Food",
    location: "Birmingham, UK",
    joinedDaysAgo: 3,
    rating: 5.0,
    totalSales: 12,
    Icon: ShoppingBag,
    badge: "New Seller",
    featuredProduct: "Ramadan Cookie Gift Box",
    featuredPrice: "£18",
    isNew: true,
  },
  {
    id: 2,
    name: "Brother Yusuf",
    shopName: "Sunnah Wellness Co.",
    category: "Health & Wellness",
    location: "Manchester, UK",
    joinedDaysAgo: 7,
    rating: 4.9,
    totalSales: 28,
    Icon: Leaf,
    badge: "Rising Star",
    featuredProduct: "Black Seed Oil Bundle",
    featuredPrice: "£24",
    isNew: true,
  },
  {
    id: 3,
    name: "Sister Khadijah",
    shopName: "Noor Calligraphy",
    category: "Islamic Art",
    location: "London, UK",
    joinedDaysAgo: 14,
    rating: 5.0,
    totalSales: 45,
    Icon: Pen,
    badge: "Top New Seller",
    featuredProduct: "Custom Bismillah Canvas",
    featuredPrice: "£55",
    isNew: false,
  },
  {
    id: 4,
    name: "Ustadh Ahmed",
    shopName: "Madinah Learning",
    category: "Education",
    location: "Leeds, UK",
    joinedDaysAgo: 10,
    rating: 4.8,
    totalSales: 19,
    Icon: BookOpen,
    badge: "New Seller",
    featuredProduct: "Arabic for Beginners Course",
    featuredPrice: "£35/mo",
    isNew: true,
  },
];

export function NewSellerSpotlight() {
  return (
    <section className="py-12 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-2xl font-bold text-gray-900">New Sellers Spotlight</h2>
            </div>
            <p className="text-gray-500 text-sm">
              Support new Muslim entrepreneurs joining our community — be their first customer!
            </p>
          </div>
          <Link href="/sellers?filter=new">
            <button className="flex items-center gap-1.5 text-amber-600 text-sm font-medium hover:text-amber-700 transition-colors">
              All New Sellers
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {NEW_SELLERS.map((seller) => (
            <Link key={seller.id} href={`/sellers/${seller.id}`}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all cursor-pointer overflow-hidden group">
                {/* Seller Header */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl"><seller.Icon className="w-5 h-5" /></span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                        seller.isNew
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {seller.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                    {seller.shopName}
                  </h3>
                  <p className="text-xs text-gray-500">{seller.name} · {seller.location}</p>
                </div>

                {/* Stats */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {seller.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" />
                      {seller.totalSales} sales
                    </span>
                    <span className="text-green-600 font-medium">
                      {seller.joinedDaysAgo}d ago
                    </span>
                  </div>

                  {/* Featured Product */}
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-xs text-gray-400 mb-0.5">Featured</p>
                    <p className="text-sm font-medium text-gray-800 leading-tight">{seller.featuredProduct}</p>
                    <p className="text-sm font-bold text-amber-600 mt-1">{seller.featuredPrice}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Become a Seller CTA */}
        <div className="mt-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white text-center sm:text-left">
            <p className="font-bold text-lg">Start Selling on Noor Today</p>
            <p className="text-white/80 text-sm">
              Join 500+ Muslim sellers. Free to start. No monthly fees. Just 8% commission.
            </p>
          </div>
          <Link href="/seller-onboarding">
            <button className="bg-white text-amber-600 font-semibold px-6 py-2.5 rounded-full hover:bg-amber-50 transition-colors text-sm whitespace-nowrap">
              Start Selling Free
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NewSellerSpotlight;
