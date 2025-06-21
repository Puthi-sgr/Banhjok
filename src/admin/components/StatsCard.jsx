import { TrendingUp, TrendingDown } from "lucide-react";

const StatsCard = ({ title, value, icon: Icon, change, changeType, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green:
      "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    purple:
      "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    orange:
      "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-4 flex items-center">
        <div
          className={`flex items-center text-sm font-medium ${
            changeType === "increase"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {changeType === "increase" ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          {change}
        </div>
        <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">
          from last month
        </span>
      </div>
    </div>
  );
};

export default StatsCard;
