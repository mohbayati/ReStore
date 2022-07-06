import { Box, Typography, Pagination } from "@mui/material";
import { MetaData } from "../models/pagination";
interface Props {
  metaData: MetaData;
  onPageChange: (page: number) => void;
}
export default function AppPagination({ metaData, onPageChange }: Props) {
  const { currentPage, pageSize, totalPages, totalCount } = metaData;
  return (
    <Box display="flex" justifyContent="space-between" alignContent="center">
      <Typography>
        Displaying {(currentPage - 1) * pageSize + 1}-
        {currentPage * pageSize > totalCount
          ? totalCount
          : currentPage * pageSize}{" "}
        of {totalCount} items
      </Typography>
      <Pagination
        color="secondary"
        size="large"
        count={totalPages}
        page={currentPage}
        onChange={(e, page) => onPageChange(page)}
      ></Pagination>
    </Box>
  );
}
