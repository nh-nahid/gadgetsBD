import Image from "next/image";
import Link from "next/link";

const CategoryCard = ({ title, images, image, link, linkText }) => {
  return (
    <Link href={link} className="bg-white p-4 flex flex-col gap-4 shadow-sm">
      <h2 className="text-xl font-bold">{title}</h2>

      {images ? (
        <div className="grid grid-cols-2 gap-2">
          {images.map((img, i) => (
            <Image width={100} height={100} alt="image" key={i} src={img} className="object-cover w-full h-full" />
          ))}
        </div>
      ) : (
        <Image height={100} width={100} alt="image" src={image} className="w-full h-full object-cover" />
      )}
      <div
        
        className="text-amazon-blue text-sm hover:underline hover:text-red-700 mt-auto"
      >
        {linkText}
      </div>
    </Link>
  );
};

export default CategoryCard;
