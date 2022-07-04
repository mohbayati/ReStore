import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, productsSelector } from "./catalogSlice";
import ProductList from "./ProductList";

export default function Catalog() {
  const products = useAppSelector(productsSelector.selectAll);
  const { productLoaded, status } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productLoaded) dispatch(fetchProductsAsync());
  }, [productLoaded, dispatch]);
  if (status.includes("pending"))
    return <LoadingComponent message="Loading Products ..." />;
  return (
    <>
      <ProductList products={products} />
      {/* <Button variant="contained">Add Product</Button> */}
    </>
  );
}
