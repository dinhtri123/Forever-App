import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string[];
  category: string;
  subCategory: string;
  sizes: string[];
  date: number;
  bestseller: boolean;
};
type ListProps = {
  token: string;
};
const List: React.FC<ListProps> = ({ token }) => {
  const [list, setList] = useState([]);
  const fetchList = async () => {
    try {
      const repsonse = await axios.get(
        backendUrl + "/api/product/list-product"
      );
      if (repsonse.data.products) {
        setList(repsonse.data.products);
      } else {
        toast.error(repsonse.data.message);
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }
  };

  const removeProduct = async (id : string) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove-product",
        { id },
        { headers: { token } }
      );
      if(response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      }else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);
  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* ----- List Table Title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 borderr bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>
        {/* ------Product List -------- */}
        {list.map((item: Product, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 borderr bg-gray-100 text-sm"
            key={index}
          >
            <img className="w-12" src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency}
              {item.price}
            </p>
            <p
              className="text-right md:text-center cursor-pointer text-lg"
              onClick={() => removeProduct(item._id)}
            >
              X
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
