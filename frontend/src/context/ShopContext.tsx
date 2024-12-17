import { createContext, ReactNode, useEffect, useState } from "react";
import { Product } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";


type CartItem = Record<string, Record<string, number>>;
type ShopContextProviderProps = {
  children: ReactNode;
};

type ShopContextType = {
  products: Product[];
  currency: string;
  delivery_fee: number;
  search: string | undefined;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  cartItem: CartItem;
  setCartItem: React.Dispatch<React.SetStateAction<CartItem>>;
  addToCart: (itemId: string, size: string) => Promise<void>;
  getCartCount: () => number;
  updateQuantity: (
    itemId: string,
    size: string,
    quantity: number
  ) => Promise<void>;
  getCartAmount: () => number;
  navigate: (path: string) => void;
  backendUrl: string;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
};

const defaultContext: ShopContextType = {
  products: [],
  currency: "$",
  delivery_fee: 10,
  search: undefined,
  setSearch: () => {},
  showSearch: false,
  setShowSearch: () => {},
  cartItem: {},
  setCartItem: () => {},
  addToCart: async () => {
    console.log("addToCart function not implemented.");
  },
  getCartCount: () => 0,
  updateQuantity: async () => {},
  getCartAmount: () => 0,
  navigate: () => {},
  backendUrl: '',
  token: '',
  setToken: () => {}
};

export const ShopContext = createContext<ShopContextType>(defaultContext);

const ShopContextProvider = ({
  children,
} : ShopContextProviderProps) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
  const [search, setSearch] = useState<string | undefined>();
  const [showSearch, setShowSearch] = useState(false);
  const [cartItem, setCartItem] = useState<CartItem>({});
  const [products, setProducts] = useState<Product[]>([])
  const [token, setToken] = useState<string | null>('')
  const navigate = useNavigate();

  const addToCart = async (itemId : string, size : string) : Promise<void> => {

    if(!size) {
      toast.error('Select Product Size');
      return;
    }

    const cartData = structuredClone(cartItem);
    if(cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    }
    else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItem(cartData)

    if(token) {
      try {
        await axios.post(backendUrl + '/api/cart/add', {itemId, size}, {headers:{token}})
      } catch (error) {
        const err = error as Error
        toast.error(err.message)
      }
    }

  }
  
  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list-product')
      if(response.data.success) {
        setProducts(response.data.products);
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      const err = error as Error
      toast.error(err.message);
    }
  }

  const getCartCount = () => {
    let totalCount = 0;
    for(const productId in cartItem) {
      for (const size in cartItem[productId]) {
        try {
          if (cartItem[productId][size] > 0) {
            totalCount += cartItem[productId][size];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  }

  const updateQuantity = async (
    itemId: string,
    size: string,
    quantity: number
  ) => {
    const cartData = structuredClone(cartItem);
    cartData[itemId][size] = quantity;
    setCartItem(cartData);
    if(token) {
      try {
        await axios.post(backendUrl + '/api/cart/update', {itemId, size, quantity}, {headers: {token}})

      } catch (error) {
        const err = error as Error;
        toast.error(err.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for(const productId in cartItem) {
      const itemInfor  = products.find(product => product._id === productId);
      for(const size in cartItem[productId]) {
        try {
          const quantity = cartItem[productId][size];
          if (quantity && itemInfor) {
            totalAmount += itemInfor.price * cartItem[productId][size];
          }
        } catch (error) { 
          const err = error as Error;
          toast.error(err.message);
        }
      }
    }
    return totalAmount
  }

  const getUserCart = async (token : string | null) => {
    try {
      const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers: {token}})
      if(response.data.success) {
        setCartItem(response.data.cartData)
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }
  }

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if(!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'))
      getUserCart(localStorage.getItem("token"));
    }
  },[])


  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItem,
    setCartItem,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token
  };
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider