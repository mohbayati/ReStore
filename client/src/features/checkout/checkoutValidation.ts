import * as yup from "yup";

export const CheckoutValidation = [
  yup.object({
    fullName: yup.string().required("Full name is required."),
    address1: yup.string().required("address 1 is required."),
    address2: yup.string().required("address 2 is required."),
    city: yup.string().required(),
    state: yup.string().required(),
    zip: yup.string().required(),
    country: yup.string().required(),
  }),
  yup.object(),
  yup.object({
    nameOfCard: yup.string().required(),
  }),
];
