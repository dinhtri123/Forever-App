import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Product } from '../assets/assets';
import Title from './Title';
import ProductItem from './ProductItem';

type RelateProductsProps = {
    category: string;
    subCategory: string
}

const RelateProducts: React.FC<RelateProductsProps> = ({
  category,
  subCategory,
}) => {
  const { products } = useContext(ShopContext) || { products: [] };
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = [...products];
      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter(
        (item) => subCategory === item.subCategory
      );
      setRelated(productsCopy.slice(0, 5));
    }
  }, [products]);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1="RELATE" text2="PRODUCT" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item) => (
          <ProductItem
            key={item._id}
            name={item.name}
            id={item._id}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default RelateProducts;