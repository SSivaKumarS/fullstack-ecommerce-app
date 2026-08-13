import { Commonloader } from "@/components/common/Loader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCustomerHomeStore } from "@/features/customer/home/store";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, Grid2X2, TicketPercent } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const pageWrapClass =
  "min-h-screen overflow-x-hidden bg-gradient-to-b from-primary/[0.02] via-background to-secondary/[0.02] antialiased selection:bg-primary/20 pb-10 sm:pb-12";
const contentContainerClass = "mx-auto w-full max-w-7xl px-0 py-4 sm:px-6 sm:py-6 lg:px-8";
const sectionStackClass = "space-y-12 sm:space-y-16 lg:space-y-20";

const sectionHeadClass = "mb-6 space-y-2.5 px-1 text-center sm:mb-10 sm:px-0 sm:text-left";
const sectionEyebrowClass =
  "text-[10px] font-bold uppercase tracking-[0.35em] bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent";
const sectionTitleClass =
  "text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl font-heading";

const bannerGridClass = "grid gap-6 lg:grid-cols-[1.6fr_1fr]";
const bannerMainCardClass =
  "group relative overflow-hidden rounded-2xl border border-primary/10 bg-card shadow-2xl transition-all duration-500 hover:shadow-3xl hover:border-primary/20 sm:rounded-[2.5rem]";
const bannerMainImageClass =
  "h-[240px] w-full object-cover transition-all duration-[800ms] group-hover:scale-102 sm:h-[360px] lg:h-[540px]";

const bannerSideGridClass = "grid gap-6 sm:grid-cols-2 lg:grid-cols-1";
const bannerSideCardClass =
  "group overflow-hidden rounded-2xl border border-primary/10 bg-card shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:border-secondary/20 sm:rounded-[2.5rem]";
const bannerSideImageClass =
  "h-[200px] w-full object-cover transition-all duration-[800ms] group-hover:scale-102 sm:h-[258px]";

const categoryGridClass = "grid gap-6 sm:grid-cols-2 xl:grid-cols-4";
const categoryCardClass =
  "group relative overflow-hidden rounded-2xl border border-primary/10 bg-card p-1.5 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/35 hover:shadow-2xl hover:shadow-primary/5 sm:rounded-[2.5rem]";
const categoryContentClass =
  "h-full space-y-5 rounded-[2.2rem] bg-gradient-to-br from-primary/[0.015] to-secondary/[0.015] p-8 backdrop-blur-sm transition-all duration-500 group-hover:bg-primary/[0.04]";
const categoryIconWrapClass =
  "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/10 to-secondary/10 text-primary ring-1 ring-primary/15 transition-transform duration-500 group-hover:scale-110";
const categoryIconClass = "h-6 w-6 text-primary";
const categoryTextWrapClass = "space-y-2";
const categoryTitleClass = "text-xl font-semibold tracking-tight text-foreground font-heading";
const categoryLinkClass =
  "inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors group-hover:text-primary/80";
const categoryArrowIconClass =
  "h-4 w-4 transition-transform group-hover:translate-x-1.5";

const couponGridClass = "grid gap-6 md:grid-cols-2 xl:grid-cols-4";
const couponCardClass =
  "group relative overflow-hidden rounded-2xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/[0.01] to-secondary/[0.01] transition-all duration-300 hover:border-primary/45 hover:from-primary/[0.03] hover:to-secondary/[0.03] hover:shadow-xl sm:rounded-[2.5rem]";
const couponContentClass = "space-y-5 p-5 sm:space-y-6 sm:p-8";
const couponHeadClass = "flex items-start justify-between gap-4";
const couponIconWrapClass =
  "flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 text-primary transition-transform duration-500 group-hover:rotate-12";
const couponIconClass = "h-6 w-6 text-primary";
const couponCodeClass = "text-2xl font-bold tracking-widest bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent";

const couponBadgeClass =
  "border-primary/15 bg-gradient-to-r from-primary/10 to-secondary/10 px-3.5 py-1 text-sm font-semibold text-primary hover:from-primary/20 hover:to-secondary/20 rounded-full border";
const couponCodeWrapClass = "space-y-1.5 pt-2";
const couponCodeLabelClass =
  "text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground";

const productGridClass = "grid gap-6 sm:grid-cols-2 xl:grid-cols-4";
const productCardClass =
  "group flex h-full flex-col overflow-hidden rounded-2xl border border-primary/10 bg-card p-2 transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 sm:rounded-[2.5rem] sm:p-2.5";
const productContentClass =
  "flex flex-1 flex-col justify-between space-y-5 p-4";
const productImageWrapClass =
  "relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-gradient-to-b from-primary/[0.02] to-secondary/[0.02] sm:rounded-[2rem]";
const productImageClass =
  "h-full w-full object-cover transition-all duration-[800ms] group-hover:scale-102";
const productInfoWrapClass = "space-y-3";
const productBrandRowClass = "flex items-center justify-between gap-3";
const productBrandClass =
  "text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground";
const productTitleClass =
  "line-clamp-2 text-base font-semibold leading-relaxed text-foreground transition-colors group-hover:text-primary font-heading";
const productPriceRowClass = "flex items-end justify-between gap-3 pt-2";
const productPriceClass =
  "text-xl font-bold tracking-tight text-foreground";
const productOriginalPriceClass =
  "text-sm font-medium text-muted-foreground line-through decoration-muted-foreground/50";
const productViewClass =
  "inline-flex h-9 items-center justify-center rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 px-5 text-xs font-bold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 hover:from-primary hover:to-secondary hover:text-white shadow-sm";

export function StoreHome() {
  const { data, loading, loadHome } = useCustomerHomeStore((state) => state);

  useEffect(() => {
    void loadHome();
  }, [loadHome]);

  if (loading) {
    return <Commonloader />;
  }

  // Safely extract banners if the array exists
  const mainBanner = data?.banners?.[0] || null;
  const sideBanners = data?.banners ? data.banners.slice(1, 3) : [];

  return (
    <div className={pageWrapClass}>
      <div className={contentContainerClass}>
        <div className={sectionStackClass}>
          {/* Only render the banner section if at least a main banner exists */}
          {mainBanner ? (
            <section>
              <div className={bannerGridClass}>
                <Card className={bannerMainCardClass}>
                  <img
                    src={mainBanner.imageUrl}
                    alt="Feature Image"
                    className={bannerMainImageClass}
                  />
                </Card>

                {sideBanners.length > 0 ? (
                  <div className={bannerSideGridClass}>
                    {sideBanners.map((item) => (
                      <Card key={item._id} className={bannerSideCardClass}>
                        <img
                          src={item.imageUrl}
                          alt="Feature Image"
                          className={bannerSideImageClass}
                        />
                      </Card>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          {data?.categories?.length ? (
            <section>
              <div className={sectionHeadClass}>
                <p className={sectionEyebrowClass}>Categories</p>
                <h2 className={sectionTitleClass}>Browse by collection</h2>
              </div>

              <div className={categoryGridClass}>
                {data.categories.slice(0, 4).map((categoryItem) => (
                  <Link to={`/collections?category=${categoryItem._id}`} key={categoryItem._id}>
                    <Card className={categoryCardClass}>
                      <CardContent className={categoryContentClass}>
                        <div className={categoryIconWrapClass}>
                          <Grid2X2 className={categoryIconClass} />
                        </div>
                        <div className={categoryTextWrapClass}>
                          <p className={categoryTitleClass}>
                            {categoryItem.name}
                          </p>
                        </div>

                        <span className={categoryLinkClass}>
                          View Collection
                          <ArrowRight className={categoryArrowIconClass} />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {data?.coupons?.length ? (
            <section>
              <div className={sectionHeadClass}>
                <p className={sectionEyebrowClass}>Offers</p>
                <h2 className={sectionTitleClass}>Live Coupon Cards</h2>
              </div>

              <div className={couponGridClass}>
                {data.coupons.slice(0, 4).map((coupon) => (
                  <Card key={coupon.code} className={couponCardClass}>
                    <CardContent className={couponContentClass}>
                      <div className={couponIconWrapClass}>
                        <TicketPercent className={couponIconClass} />
                      </div>
                      <Badge className={couponBadgeClass}>
                        {coupon.percentage}% OFF
                      </Badge>

                      <div className={couponCodeWrapClass}>
                        <p className={couponCodeLabelClass}>Coupon Code</p>
                        <p className={couponCodeClass}>{coupon.code}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ) : null}

          {data?.recentProducts?.length ? (
            <section>
              <div className={sectionHeadClass}>
                <p className={sectionEyebrowClass}>Latest</p>
                <h2 className={sectionTitleClass}>Recent Products</h2>
              </div>
              <div className={productGridClass}>
                {data.recentProducts.slice(0, 4).map((product) => (
                  <Link to={`/collection/${product._id}`} key={product._id}>
                    <Card className={productCardClass}>
                      <CardContent className={productContentClass}>
                        <div className={productImageWrapClass}>
                          <img
                            src={product.image}
                            alt={product.title}
                            className={productImageClass}
                          />
                        </div>
                        <div className={productInfoWrapClass}>
                          <div className={productBrandRowClass}>
                            <p className={productBrandClass}>{product.brand}</p>
                          </div>
                          <p className={productTitleClass}>{product.title}</p>
                        </div>

                        <div className={productPriceRowClass}>
                          <div>
                            <p className={productPriceClass}>
                              {formatPrice(product.finalPrice)}
                            </p>
                            {product.salePercentage > 0 ? (
                              <p className={productOriginalPriceClass}>
                                {formatPrice(product.price)}
                              </p>
                            ) : null}
                          </div>

                          <span className={productViewClass}>View</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
