import { Link } from "react-router-dom";
import { Star, Clock, DollarSign, MapPin } from "lucide-react";

export const VendorCard = ({ vendor }) => {
  return (
    <Link to={`/vendor/${vendor.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img
            src={vendor.image}
            alt={vendor.name}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* {!vendor.isOpen && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-medium">Closed</span>
            </div>
          )} */}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
              {vendor.name}
            </h3>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">
                {vendor.rating}
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{vendor.address || "N/A"}</span>
          </p>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{Math.floor(Math.random() * 25) + 1} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>${Math.floor(Math.random() * 2.5) + 0.5}</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {vendor.food_types.slice(0, 3).map((type, index) => (
              <span
                key={index}
                className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};
