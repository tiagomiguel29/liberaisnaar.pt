"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
  if (onPageChange)
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              isActive={currentPage !== 1}
              aria-disabled={currentPage <= 1}
              tabIndex={currentPage <= 1 ? -1 : undefined}
              className={currentPage <= 1 ? "pointer-events-none" : undefined}
            />
          </PaginationItem>
          <PaginationItem>
            <Select>
              <SelectTrigger className="w-24">
                <SelectValue placeholder={currentPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[...new Array(totalPages)].map((_, i) => (
                    <SelectItem
                      key={i}
                      value={i.toString()}
                      onClick={() => onPageChange(i + 1)}
                    >
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              isActive={currentPage !== totalPages}
              aria-disabled={currentPage >= totalPages}
              tabIndex={currentPage >= totalPages ? -1 : undefined}
              className={
                currentPage >= totalPages ? "pointer-events-none" : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

  function onSelectChange(page: string) {
    if (href) {
      window.location.href = `${basePath}?page=${page}&limit=${limit}`;
    }
  }

  if (href && basePath) {
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`${basePath}?page=${currentPage - 1}&limit=${limit}`}
              isActive={currentPage !== 1}
              aria-disabled={currentPage <= 1}
              tabIndex={currentPage <= 1 ? -1 : undefined}
              className={currentPage <= 1 ? "pointer-events-none" : undefined}
            />
          </PaginationItem>
          <PaginationItem>
            <Select onValueChange={onSelectChange}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder={currentPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[...new Array(totalPages)].map((_, i) => (
                    <SelectItem
                      key={i}
                      value={(i+1).toString()}
                    >
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={`${basePath}?page=${currentPage + 1}&limit=${limit}`}
              isActive={currentPage !== totalPages}
              aria-disabled={currentPage >= totalPages}
              tabIndex={currentPage >= totalPages ? -1 : undefined}
              className={
                currentPage >= totalPages ? "pointer-events-none" : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }
}
