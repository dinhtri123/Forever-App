import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

interface ProductItemProps {
    id: string, 
    image: string[],
    name: string, 
    price: number
}

const ProductItem = ({ id, image, name, price }: ProductItemProps) => {
    const { currency } = useContext(ShopContext)
  return (
    <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer">
      <div className="overflow-hidden">
        <img
          src={image.length > 0 ? image[0] : ''}
          className="hover:scale-110 transition ease-in-out"
          alt=""
        />
      </div>
        <p className="pt-3 pb-1 text-sm">{name}</p>
        <p className="text-sm font-medium">
          {currency}
          {price}
        </p>
    </Link>
  );
};

export default ProductItem;