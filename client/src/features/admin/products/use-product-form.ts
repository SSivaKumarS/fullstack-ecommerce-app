import { useEffect, useState } from "react";
import type { Category, Product, ProductFormState, ProductImage } from "./types";
import { createAdminProduct, updateAdminProduct } from "./api";
import { BRANDS } from "./constants";

type UseProductFormOptions = {
  open: boolean;
  product: Product | null;
  categories: Category[];
  onSaved: () => Promise<void>;
  onClose: () => void;
};

function getEmptyForm(): ProductFormState {
  return {
    title: "",
    description: "",
    category: "",
    brand: BRANDS[0] ?? "",
    colors: [],
    sizes: [],
    price: "",
    salePercentage: "0",
    stock: "",
    status: "active",
    existingImages: [],
    newFiles: [],
    coverImagePublicId: "",
  };
}

export function getCoverImage(images: ProductImage[] = []) {
  return images.find((img) => img.isCover) ?? images[0];
}

function mapProductToFormValues(product: Product): ProductFormState {
  const cover = getCoverImage(product.images);

  return {
    title: product.title,
    description: product.description,
    category: product.category._id,
    brand: product.brand,
    colors: product.colors ?? [],
    sizes: product.sizes ?? [],
    price: String(product.price),
    salePercentage: String(product.salePercentage ?? 0),
    stock: String(product.stock),
    status: product.status,
    existingImages: product.images ?? [],
    newFiles: [],
    coverImagePublicId: cover?.publicId ?? "",
  };
}

export function useProductForm({
  open,
  onClose,
  onSaved,
  product,
  categories,
}: UseProductFormOptions) {
  const [form, setForm] = useState<ProductFormState>(getEmptyForm());
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setForm(getEmptyForm());
      setSubmitError(null);
      return;
    }

    setForm(product ? mapProductToFormValues(product) : getEmptyForm());
  }, [open, product]);

  useEffect(() => {
    if (!open || product || !categories.length || form.category) return;

    setForm((prev) => ({
      ...prev,
      category: categories[0]._id,
    }));
  }, [open, product, categories, form.category]);

  // If no brand has been selected and dialog opens for a new product, default to the
  // first brand in the BRANDS constant so client-side validation doesn't fail.
  useEffect(() => {
    if (!open || product || form.brand) return;

    setForm((prev) => ({ ...prev, brand: BRANDS[0] ?? "" }));
  }, [open, product, form.brand]);

  function toggleSize(size: string) {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((item) => item !== size)
        : [...prev.sizes, size],
    }));
  }

  function addColor(color: string) {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors
        : [...prev.colors, color],
    }));
  }

  function removeColor(color: string) {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((item) => item !== color),
    }));
  }

  function addFiles(files: FileList | null) {
    if (!files?.length) return;

    setForm((prev) => ({
      ...prev,
      newFiles: [...prev.newFiles, ...Array.from(files)],
    }));
  }

  function updateField<K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function removeExistingImage(publicId: string) {
    setForm((prev) => {
      const nextImages = prev.existingImages.filter(
        (image) => image.publicId !== publicId,
      );

      const nextCoverImageId =
        prev.coverImagePublicId === publicId
          ? (nextImages[0]?.publicId ?? "")
          : prev.coverImagePublicId;

      return {
        ...prev,
        existingImages: nextImages,
        coverImagePublicId: nextCoverImageId,
      };
    });
  }

  function changeCoverImage(publicId: string) {
    updateField("coverImagePublicId", publicId);
  }

  async function submit() {
    const hasImages = form.newFiles.length > 0 || form.existingImages.length > 0;
    const hasRequiredFields =
      form.title.trim() &&
      form.description.trim() &&
      form.category &&
      form.brand.trim() &&
      form.price.trim() &&
      form.stock.trim() &&
      hasImages;

    if (!hasRequiredFields) {
      const missingFields: string[] = [];

      if (!form.title.trim()) missingFields.push("title");
      if (!form.description.trim()) missingFields.push("description");
      if (!form.category) missingFields.push("category");
      if (!form.brand.trim()) missingFields.push("brand");
      if (!form.price.trim()) missingFields.push("price");
      if (!form.stock.trim()) missingFields.push("stock");
      if (!hasImages) missingFields.push("at least one image");

      setSubmitError(`Please complete the required fields: ${missingFields.join(", ")}.`);
      return;
    }

    try {
      setSaving(true);
      setSubmitError(null);

      if (product) {
        await updateAdminProduct(
          product._id,
          {
            title: form.title.trim(),
            description: form.description.trim(),
            category: form.category,
            brand: form.brand,
            colors: form.colors,
            sizes: form.sizes,
            price: Number(form.price),
            salePercentage: Number(form.salePercentage) || 0,
            stock: Number(form.stock),
            status: form.status,
            existingImages: form.existingImages,
            coverImagePublicId: form.coverImagePublicId || undefined,
          },
          form.newFiles,
        );
      } else {
        await createAdminProduct(
          {
            title: form.title.trim(),
            description: form.description.trim(),
            category: form.category,
            brand: form.brand,
            colors: form.colors,
            sizes: form.sizes,
            price: Number(form.price),
            salePercentage: Number(form.salePercentage) || 0,
            stock: Number(form.stock),
            status: form.status,
          },
          form.newFiles,
        );
      }

      await onSaved();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save product.";
      setSubmitError(message);
    } finally {
      setSaving(false);
    }
  }

  return {
    form,
    saving,
    submitError,
    isEditMode: !!product,
    toggleSize,
    addColor,
    removeColor,
    addFiles,
    submit,
    updateField,
    removeExistingImage,
    changeCoverImage,
  };
}
