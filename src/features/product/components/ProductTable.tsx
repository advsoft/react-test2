import { useCallback, useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import type { Product } from '../types/product.ts';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination';
import { Skeleton } from '@/shared/ui/skeleton';
import { cn } from '@/shared/lib/utils';
import { getCategoryLabel } from '../constants/categories.ts';

const RATING_LOW_THRESHOLD = 3.5;

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  isFetching?: boolean;
  sortBy?: string;
  order?: 'asc' | 'desc';
  total: number;
  pageSize: number;
  currentPage: number;
  onSortChange: (sortBy: string | undefined, order: 'asc' | 'desc') => void;
  onPageChange: (page: number) => void;
  onEdit?: (product: Product) => void;
}

function formatRating(value: number): string {
  return `${value.toFixed(1)}/5`;
}

function formatPrice(value: number): string {
  const [int, dec] = value.toFixed(2).split('.');
  return `${parseInt(int, 10).toLocaleString('ru-RU')},${dec}`;
}

function SortableHead({
  label,
  columnKey,
  sortBy,
  order,
  onSort,
  className,
}: {
  label: string;
  columnKey: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  onSort: () => void;
  className?: string;
}) {
  const isActive = sortBy === columnKey;
  return (
    <TableHead
      className={cn("cursor-pointer select-none font-bold px-4 py-6 text-base text-muted-foreground", className)}
      onClick={onSort}
    >
      {label}
      {isActive && (
        <span className="ml-1">{order === 'asc' ? '↑' : '↓'}</span>
      )}
    </TableHead>
  );
}

export function ProductTable({
  products,
  loading,
  isFetching = false,
  sortBy,
  order,
  total,
  pageSize,
  currentPage,
  onSortChange,
  onPageChange,
  onEdit,
}: ProductTableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleSort = useCallback(
    (key: string) => {
      if (sortBy === key) {
        onSortChange(key, order === 'asc' ? 'desc' : 'asc');
      } else {
        onSortChange(key, 'asc');
      }
    },
    [sortBy, order, onSortChange]
  );

  if (loading && products.length === 0) {
    return <Skeleton className="h-[400px] w-full rounded-lg" />;
  }

  const startItem = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="relative">
      {isFetching && (
        <div className="absolute top-0 left-0 right-0 z-10 h-1 overflow-hidden rounded-t-lg bg-gray-100">
          <div className="product-table-loader-bar h-full w-1/3 rounded-full bg-primary" />
        </div>
      )}
      <Table className="table-fixed w-full">
        <colgroup>
          <col style={{ width: 320 }} />
          <col style={{ width: 128 }} />
          <col style={{ width: 160 }} />
          <col style={{ width: 100 }} />
          <col style={{ width: 120 }} />
          <col style={{ width: 128 }} />
        </colgroup>
        <TableHeader>
          <TableRow className="border-gray-200">
            <TableHead
              className="w-[320px] px-4 py-6 font-bold cursor-pointer select-none text-base text-muted-foreground"
              onClick={() => handleSort('title')}
            >
              <div className="flex items-center gap-5">
                <div onClick={(e) => e.stopPropagation()} role="presentation">
                  <Checkbox
                    checked={selectedRowKeys.length === products.length && products.length > 0}
                    onCheckedChange={(checked) =>
                      setSelectedRowKeys(checked ? products.map((p) => p.id) : [])
                    }
                  />
                </div>
                Наименование
                {sortBy === 'title' && (
                  <span className="ml-1">{order === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </TableHead>
            <SortableHead
              label="Вендор"
              columnKey="brand"
              sortBy={sortBy}
              order={order}
              onSort={() => handleSort('brand')}
              className="w-[128px]"
            />
            <SortableHead
              label="Артикул"
              columnKey="sku"
              sortBy={sortBy}
              order={order}
              onSort={() => handleSort('sku')}
              className="w-[160px]"
            />
            <SortableHead
              label="Оценка"
              columnKey="rating"
              sortBy={sortBy}
              order={order}
              onSort={() => handleSort('rating')}
              className="w-[100px]"
            />
            <SortableHead
              label="Цена, ₽"
              columnKey="price"
              sortBy={sortBy}
              order={order}
              onSort={() => handleSort('price')}
              className="w-[120px]"
            />
            <TableHead className="w-[128px] px-4 py-6" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((record) => (
            <TableRow
              key={record.id}
              className={cn(
                'border-gray-200 h-[4.5rem]',
                selectedRowKeys.includes(record.id) && 'product-table-row-selected'
              )}
            >
              <TableCell className="overflow-hidden px-4 py-3">
                <div className="flex min-w-0 items-center gap-5">
                  <Checkbox
                    checked={selectedRowKeys.includes(record.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRowKeys((k) => [...k, record.id]);
                      } else {
                        setSelectedRowKeys((k) => k.filter((id) => id !== record.id));
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  {record.thumbnail ? (
                    <img
                      src={record.thumbnail}
                      alt=""
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg border border-gray-200 bg-gray-300" />
                  )}
                  <div className="flex min-w-0 flex-col gap-2.5">
                    <span className="truncate font-bold text-base text-gray-900">
                      {record.title}
                    </span>
                    <span className="truncate text-sm text-muted-foreground">
                      {getCategoryLabel(record.category)}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="overflow-hidden px-4 py-3 text-base text-gray-900">
                <span className="block truncate">{record.brand}</span>
              </TableCell>
              <TableCell className="overflow-hidden px-4 py-3 text-base text-gray-900">
                <span className="block truncate">{record.sku}</span>
              </TableCell>
              <TableCell
                className={cn(
                  'px-4 py-3 text-base',
                  record.rating < RATING_LOW_THRESHOLD ? 'text-destructive' : 'text-gray-900'
                )}
              >
                {formatRating(record.rating)}
              </TableCell>
              <TableCell className="px-4 py-3 text-base text-gray-900">
                {formatPrice(record.price)}
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex gap-8 items-center justify-center">
                  <button
                    type="button"
                    className="flex items-center justify-center size-8 w-15 rounded-lg p-1 cursor-pointer bg-primary hover:bg-primary/90"
                  >
                    <Plus className="size-6 text-primary-foreground" />
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button
                          type="button"
                          className="flex items-center justify-center size-8 rounded-full cursor-pointer border border-gray-200 bg-white hover:bg-gray-50 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <MoreHorizontal className="size-5" />
                        </button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => onEdit?.(record)}>
                        Редактировать
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between py-3">
        <span className="text-lg text-gray-700">
          Показано{' '}
          <span className="text-muted-foreground">{startItem}-{endItem}</span> из{' '}
          <span className="text-muted-foreground">{total}</span>
        </span>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                asButton
                text=""
                className={cn(currentPage <= 1 && 'pointer-events-none opacity-50')}
                onClick={() => {
                  if (currentPage > 1) onPageChange(currentPage - 1);
                }}
              />
            </PaginationItem>
            {Array.from(
              { length: Math.min(5, totalPages) },
              (_, i) => i + 1
            ).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  asButton
                  isActive={p === currentPage}
                  className={cn(
                    p === currentPage &&
                      'bg-pagination-active text-white border-0 hover:bg-pagination-active/90 hover:text-white'
                  )}
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                asButton
                text=""
                className={cn(currentPage >= totalPages && 'pointer-events-none opacity-50')}
                onClick={() => {
                  if (currentPage < totalPages) onPageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
