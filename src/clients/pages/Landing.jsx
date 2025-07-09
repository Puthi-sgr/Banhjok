import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Clock, Truck } from "lucide-react";
import Slider from "react-slick";
import { SearchBar } from "../components/SearchBar";
import { FoodCard } from "../components/FoodCard";
import { VendorCard } from "../components/VendorCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useFood } from "../contexts/FoodContext";
import { useVendor } from "../contexts/VendorContext";

export const Landing = () => {
  const { foods } = useFood();
  const { vendors } = useVendor();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div
          className="relative min-h-[600px] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200')`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Delicious Food,{" "}
              <span className="text-orange-300">Delivered Fast</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Order from your favorite restaurants and get it delivered to your
              door
            </p>
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar
                placeholder="Search for food, restaurants..."
                className="transform hover:scale-105 text-gray-800 transition-transform duration-200"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>4.8+ Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-400" />
                <span>30 min delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-blue-400" />
                <span>Free delivery over $25</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Foods Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Top Foods</h2>
            <Link
              to="/explore"
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <Slider {...sliderSettings}>
            {foods &&
              foods.length > 0 &&
              foods.map((food) => (
                <div key={food.id} className="px-2">
                  <FoodCard food={food} />
                </div>
              ))}
          </Slider>
        </div>
      </section>

      {/* Recommended Foods Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Recommended For You
            </h2>
            <Link
              to="/explore"
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {foods &&
              foods.length > 0 &&
              foods.map((food) => (
                <div key={food.id} className="">
                  <FoodCard food={food} />
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Popular Vendors Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Popular Vendors
            </h2>
            <Link
              to="/explore"
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors &&
              vendors.length > 0 &&
              vendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};
