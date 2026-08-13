import { Commonloader } from "@/components/common/Loader";
import CustomerFiltersPanel from "@/components/customer/products/customer-filters-panel";
import CustomerProductCard from "@/components/customer/products/customer-product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { ProductSort } from "@/features/customer/products/types";
import { useCustomerProductList } from "@/features/customer/products/use-customer-collections";
import { SlidersHorizontal } from "lucide-react";

const pageWrapClass = "min-h-screen overflow-x-hidden bg-gradient-to-b from-primary/[0.015] via-background to-secondary/[0.015] pb-12 sm:pb-16";

const heroSectionClass =
  "border-b border-primary/10 bg-gradient-to-r from-primary/10 via-background to-secondary/10";

const heroContainerClass = "mx-auto w-full max-w-7xl px-0 py-8 sm:px-6 sm:py-12 lg:px-8";

const heroEyebrowClass = "text-xs font-bold uppercase tracking-[0.3em] bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent";

const heroContentClass =
  "mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between";

const heroTitleWrapClass = "space-y-2";

const heroTitleClass =
  "text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl font-heading";

const sortWrapClass = "flex w-full items-center gap-3 text-sm font-medium text-muted-foreground sm:w-auto";

const sortTriggerClass = "w-full rounded-xl border border-primary/15 bg-card px-3.5 shadow-sm sm:w-[190px]";

const contentContainerClass = "mx-auto w-full max-w-7xl px-0 py-6 sm:px-6 sm:py-8 lg:px-8";

const topBarClass =
  "mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between";

const activeBadgesWrapClass = "flex flex-wrap items-center gap-2";

const activeBadgeClass =
  "border-primary/15 bg-primary/5 text-primary hover:bg-primary/10 px-3.5 py-1 rounded-full text-xs font-semibold";

const topBarActionsClass = "flex w-full items-center gap-3 sm:w-auto";

const mobileFilterButtonClass = "w-full rounded-xl border border-primary/15 bg-card hover:bg-primary/5 text-foreground lg:hidden shadow-sm sm:w-auto";

const mobileFilterIconClass = "mr-2 h-4 w-4 text-primary";

const mobileSheetContentClass = "w-[min(100vw,24rem)] max-w-[100vw] border-l border-primary/10 bg-card p-4 sm:p-6";

const mobileSheetHeaderClass = "sr-only";

const layoutGridClass = "grid gap-8 lg:grid-cols-[290px_minmax(0,1fr)]";

const desktopAsideClass = "hidden lg:block";

const desktopFilterCardClass = "sticky top-24 border border-primary/10 bg-card/75 p-6 shadow-xl shadow-primary/[0.02] backdrop-blur-md rounded-[2rem]";

const productSectionClass = "space-y-6";

const actionButtonClass = "rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90";

const emptyCardClass = "border border-primary/10 bg-card/50 rounded-[2rem]";

const emptyCardContentClass =
  "flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center";

const emptyTitleClass = "text-xl font-bold text-foreground font-heading";

const productGridClass = "grid gap-6 sm:grid-cols-2 xl:grid-cols-3";

function Collections() {
  const {
    sort,
    changeSort,
    loading,
    products,
    hasActiveFilters,
    categories,
    availableColors,
    filters,
    toggleFacet,
    clearFilters,
    activeFilterBadges,
  } = useCustomerProductList();

  if (loading) return <Commonloader />;

  return (
    <div className={pageWrapClass}>
      <section className={heroSectionClass}>
        <div className={heroContainerClass}>
          <p className={heroEyebrowClass}>New Collections</p>

          <div className={heroContentClass}>
            <div className={heroTitleWrapClass}>
              <h1 className={heroTitleClass}>Premium everyday essentials</h1>
            </div>

            <div className={sortWrapClass}>
              <Select
                value={sort}
                onValueChange={(value) => changeSort(value as ProductSort)}
              >
                <SelectTrigger className={sortTriggerClass}>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="recent">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <div className={contentContainerClass}>
        <div className={topBarClass}>
          <div className={activeBadgesWrapClass}>
            {activeFilterBadges.map((item) => (
              <Badge key={item.key} className={activeBadgeClass}>
                {item.label}: {item.value}
              </Badge>
            ))}
          </div>

          {/* mobile sheet component */}
          <div className={topBarActionsClass}>
            <Sheet>
              <SheetTrigger asChild>
                <Button className={mobileFilterButtonClass}>
                  <SlidersHorizontal className={mobileFilterIconClass} />
                  Filters
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className={mobileSheetContentClass}>
                <SheetHeader className={mobileSheetHeaderClass}>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>

                <CustomerFiltersPanel
                  categories={categories}
                  filters={filters}
                  availableColors={availableColors}
                  hasActiveFilters={hasActiveFilters}
                  onClearFilters={clearFilters}
                  onToggleFacet={toggleFacet}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className={layoutGridClass}>
          <aside className={desktopAsideClass}>
            <Card className={desktopFilterCardClass}>
              <CustomerFiltersPanel
                categories={categories}
                filters={filters}
                availableColors={availableColors}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearFilters}
                onToggleFacet={toggleFacet}
              />
            </Card>
          </aside>

          <section className={productSectionClass}>
            {!loading && !products.length ? (
              <Card className={emptyCardClass}>
                <CardContent className={emptyCardContentClass}>
                  <p className={emptyTitleClass}>No Products Found</p>
                  {hasActiveFilters ? (
                    <Button
                      onClick={clearFilters}
                      className={actionButtonClass}
                    >
                      Clear Filters
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            {!loading && products.length ? (
              <div className={productGridClass}>
                {products.map((item) => (
                  <CustomerProductCard key={item._id} product={item} />
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Collections;
