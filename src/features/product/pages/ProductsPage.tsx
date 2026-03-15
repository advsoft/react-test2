import { useState } from 'react';
import { LogOut, Plus, RefreshCw, X } from 'lucide-react';
import { AuthGuard } from '@/features/auth/components/AuthGuard.tsx';
import { useAuth } from '@/features/auth/hooks/useAuth.ts';
import { ProductTable } from '../components/ProductTable.tsx';
import { AddProductModal } from '../components/AddProductModal.tsx';
import { useProducts } from '../hooks/useProducts.ts';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export function ProductsPage() {
  const {
    products,
    total,
    isLoading,
    isFetching,
    search,
    setSearch,
    sortBy,
    order,
    setSort,
    page,
    setPage,
    pageSize,
    refetch,
  } = useProducts();
  const { logout } = useAuth();
  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="relative flex items-center mx-5 rounded-lg h-20 bg-white px-8 my-5">
          <h1 className="text-2xl font-bold text-gray-900">
            Товары
          </h1>
          <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-xl px-4">
            <div className="relative">
              <Input
                placeholder="Найти"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg bg-muted border-0 pr-10"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Очистить поиск"
                >
                  <X className="size-5" />
                </button>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => logout()}
            className="absolute right-8 h-11 w-11 rounded-lg"
            aria-label="Выйти"
          >
            <LogOut className="size-5" />
          </Button>
        </header>

        <main className="mx-5 pb-8">
          <div className="flex flex-col rounded-xl bg-white px-8 py-5 gap-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold m-0 text-gray-700">
                Все позиции
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => refetch()}
                  className="h-11 w-11 shrink-0 border-gray-200 bg-white rounded-lg"
                >
                  <RefreshCw className="size-5" />
                </Button>
                <Button
                  onClick={() => setAddModalOpen(true)}
                  className="h-11 bg-primary hover:bg-primary/90 px-5 rounded-lg"
                >
                  <Plus className="size-5 mr-2" />
                  Добавить
                </Button>
              </div>
            </div>

            <ProductTable
              products={products}
              loading={isLoading}
              isFetching={isFetching}
              sortBy={sortBy}
              order={order}
              total={total}
              pageSize={pageSize}
              currentPage={page}
              onSortChange={setSort}
              onPageChange={setPage}
            />
          </div>
        </main>
      </div>
      <AddProductModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </AuthGuard>
  );
}
