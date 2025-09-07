import Image from "next/image";

const categories = [
  {
    id: 1,
    name: "Ethnic Wear",
    discount: "50-80% OFF",
    image: "/images/ethnic-wear.jpg",
  },
  {
    id: 2,
    name: "WFH Casual Wear",
    discount: "40-80% OFF",
    image: "/images/casual-wear.jpg",
  },
  {
    id: 3,
    name: "Activewear",
    discount: "30-70% OFF",
    image: "/images/activewear.jpg",
  },
  {
    id: 4,
    name: "Western Wear",
    discount: "40-80% OFF",
    image: "/images/western-wear.jpg",
  },
  {
    id: 5,
    name: "Sportswear",
    discount: "30-80% OFF",
    image: "/images/sportswear.jpg",
  },
];

export default function CategoryGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-primary text-center mb-6">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative rounded-lg overflow-hidden shadow-lg group"
          >
            <Image
              src={category.image}
              alt={category.name}
              width={300}
              height={400}
              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-accent/80 to-transparent p-4 text-white">
              <h3 className="text-lg font-bold">{category.name}</h3>
              <p className="text-sm">{category.discount}</p>
              <button className="mt-2 bg-secondary text-white px-3 py-1 rounded-md text-sm">
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
