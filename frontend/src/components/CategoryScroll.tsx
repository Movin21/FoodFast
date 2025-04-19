import React, { useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const hideScrollbarStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

interface Category {
  id: string;
  name: string;
  icon: string;
}
const categories: Category[] = [
  {
    id: "1",
    name: "All Category",
    icon: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "1",
    name: "Grocery",
    icon: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "2",
    name: "Pizza",
    icon: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "3",
    name: "Desserts",
    icon: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "4",
    name: "Bakery",
    icon: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "5",
    name: "Burgers",
    icon: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "8",
    name: "Chinese",
    icon: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "9",
    name: "Sweets",
    icon: "https://images.unsplash.com/photo-1602296750425-f025b045f8fa?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "10",
    name: "Healthy",
    icon: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "11",
    name: "Indian",
    icon: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "12",
    name: "Soup",
    icon: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "13",
    name: "Korean",
    icon: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "14",
    name: "Sushi",
    icon: "https://images.unsplash.com/photo-1563612116625-3012372fccce?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "15",
    name: "Thai",
    icon: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "16",
    name: "Fast Food",
    icon: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "17",
    name: "Sandwich",
    icon: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "18",
    name: "Japanese",
    icon: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "21",
    name: "BBQ",
    icon: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "22",
    name: "Coffee",
    icon: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "25",
    name: "Ice Cream",
    icon: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "26",
    name: "Italian",
    icon: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "27",
    name: "Seafood",
    icon: "https://images.unsplash.com/photo-1579767684138-8c23cf4a69a4?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "28",
    name: "Asian",
    icon: "https://images.unsplash.com/photo-1541696490-8744a5dc0228?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "30",
    name: "Mexican",
    icon: "https://images.unsplash.com/photo-1551504734-5ee1c4a3479b?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "31",
    name: "American",
    icon: "https://images.unsplash.com/photo-1576843776838-032ac46fbb93?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "32",
    name: "Breakfast",
    icon: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    id: "33",
    name: "Salads",
    icon: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=100&h=100&q=80",
  },
];
interface CategoryScrollProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}
const CategoryScroll: React.FC<CategoryScrollProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };
  return (
    <>
      <style>{hideScrollbarStyles}</style>
      <div className="relative bg-white py-6">
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-[45%] -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 flex items-center justify-center"
        >
          <ChevronLeftIcon size={20} className="text-black" />
        </button>

        {/* Add a fixed height to the container */}
        <div
          className="h-32 overflow-x-scroll scrollbar-hide mx-10"
          ref={scrollRef}
        >
          <div className="flex space-x-8 px-4 min-w-max h-full items-center">
            {/* Your category items */}
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => onSelectCategory(category.name)}
              >
                <div
                  className={`
                    w-16 h-16 rounded-full overflow-hidden mb-2 
                    transform transition-transform duration-200 
                    group-hover:scale-110 relative
                    ${
                      selectedCategory === category.name
                        ? "ring-2 ring-black"
                        : ""
                    }
                  `}
                >
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span
                  className={`
                    text-sm whitespace-nowrap
                    ${
                      selectedCategory === category.name
                        ? "text-black font-medium"
                        : "text-gray-600"
                    }
                  `}
                >
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-[45%] -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 flex items-center justify-center"
        >
          <ChevronRightIcon size={20} className="text-black" />
        </button>
      </div>
    </>
  );
};
export default CategoryScroll;
