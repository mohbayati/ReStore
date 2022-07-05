import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Pagination,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {
  fetchFilters,
  fetchProductsAsync,
  productsSelector,
} from "./catalogSlice";
import ProductList from "./ProductList";

const sortOption = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price - High to low" },
  { value: "price", label: "Price - Low to High" },
];

export default function Catalog() {
  const products = useAppSelector(productsSelector.selectAll);
  const { productLoaded, status, filtersLoaded, brands, types } =
    useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productLoaded) dispatch(fetchProductsAsync());
  }, [productLoaded, dispatch]);
  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchFilters());
  }, [filtersLoaded, dispatch]);

  if (status.includes("pending"))
    return <LoadingComponent message="Loading Products ..." />;
  return (
    <Grid container spacing={4}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <TextField label="Search products" variant="outlined" fullWidth />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <FormControl component="fieldset">
            <RadioGroup>
              {sortOption.map(({ value, label }) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio />}
                  label={label}
                ></FormControlLabel>
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <FormGroup>
            {brands.map((brand) => (
              <FormControlLabel
                key={brand}
                control={<Checkbox />}
                label={brand}
              ></FormControlLabel>
            ))}
          </FormGroup>
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <FormGroup>
            {types.map((type) => (
              <FormControlLabel
                key={type}
                control={<Checkbox />}
                label={type}
              ></FormControlLabel>
            ))}
          </FormGroup>
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>
      <Grid item xs={3}></Grid>
      <Grid item xs={9}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignContent="center"
        >
          <Typography>Displaying 1-6 0f 20 items</Typography>
          <Pagination
            color="secondary"
            size="large"
            count={10}
            page={2}
          ></Pagination>
        </Box>
      </Grid>

      {/* <Button variant="contained">Add Product</Button> */}
    </Grid>
  );
}
