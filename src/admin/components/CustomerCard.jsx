import { Link } from "react-router-dom";
import { Eye, Mail, Phone, MapPin, Trash, Pencil, Edit } from "lucide-react";
import noProfile from "../../assets/images/no-profile.png";

const CustomerCard = ({ customer, onAlert, onDelete, onEdit }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <img
          src={customer.image || noProfile}
          alt={customer.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {customer.name}
        </h3>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
          <Mail className="h-4 w-4 mr-2" />
          <span className="truncate">{customer.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
          <Phone className="h-4 w-4 mr-2" />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="truncate">{customer.address}</span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Location: {customer.location}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Joined: {new Date(customer.created_at).toLocaleDateString()}
        </div>
        <div className="flex">
          <Link
            to={`/dashboard/customers/${customer.id}`}
            className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Link>
          <button
            onClick={() => onEdit(customer.id)}
            className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </button>
          <button
            onClick={() => onDelete(customer.id)}
            className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
