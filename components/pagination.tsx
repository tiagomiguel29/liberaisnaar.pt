"use client";

import { Pagination } from "@mui/material";

type PaginatorProps = {
  currentPage: number;
  limit: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  href?: boolean;
  basePath?: string;
};

export function Paginator({
  currentPage,
  totalPages,
  limit,
  onPageChange,
  href,
  basePath,
}: PaginatorProps) {
  
  const changeProps = () => {
    if (onPageChange)
      return {
        onChange: (event: any, page: number) => onPageChange(page),
      };

    if (href && basePath)
      return {
        onChange: (event: any, page: number) => onSelectChange(page.toString()),
      };
  };

  function onSelectChange(page: string) {
    if (href) {
      const searchParams = new URLSearchParams(window.location.search);

      searchParams.set("page", page);
      searchParams.set("limit", limit.toString());

      const newUrl = `${basePath}?${searchParams.toString()}`;

      window.location.href = newUrl;
    }
  }

  return (
    <Pagination
      shape="rounded"
      size="large"
      color="primary"
      siblingCount={2}
      boundaryCount={1}
      count={totalPages}
      page={currentPage}
      showFirstButton
      showLastButton
      {...changeProps()}
    />
  );
}
