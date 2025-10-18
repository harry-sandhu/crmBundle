// src/pages/Admin/Products/AddProduct.tsx
import { useRef, useState } from "react";
import api from "../../utils/api";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";

type ApiOk<T> = { ok: true; data: T; message?: string };
type ApiFail = { ok: false; message: string };

type CreateProductBody = {
  name: string;
  description: string;
  price: number;
  category: string;
  mrp: number;
  dp: number;
};

type Product = CreateProductBody & {
  _id: string;
  image: string; // URL
  createdAt: string;
  updatedAt: string;
};

type CreateProductResponse = ApiOk<Product> | ApiFail;

type FormInput = {
  name: string;
  description: string;
  price: string;
  category: string;
  mrp: string;
  dp: string;
  imageFile: FileList;
};

export default function AddProduct() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormInput>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      mrp: "",
      dp: "",
      imageFile: undefined as unknown as FileList,
    },
  });

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [preview, setPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f) {
      setSelectedFile(f);
      setSelectedFileName(f.name);
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      clearImage();
    }
  }

  function clearImage() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
    setSelectedFile(null);
    setSelectedFileName("");
    // Clear RHF field
    setValue("imageFile", undefined as unknown as FileList, { shouldValidate: true });
    // Clear the native input value so the same file can be reselected
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(values: FormInput) {
    setMsg("");
    setErr("");

    try {
      const form = new FormData();
      form.append("name", values.name.trim());
      form.append("description", values.description.trim());
      form.append("price", values.price || "0");
      form.append("category", values.category.trim());
      form.append("mrp", values.mrp || "0");
      form.append("dp", values.dp || "0");

      const file = selectedFile;
      if (!file) {
        setErr("Please choose an image file");
        return;
      }
      form.append("imageFile", file);

      const res = await api.post<CreateProductResponse>("/admin/products", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res.data.ok) {
        setErr(res.data.message || "Create failed");
        return;
      }

      setMsg("Product created successfully");
      reset();
      clearImage();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const ax = error as AxiosError<ApiFail>;
        const status = ax.response?.status ?? "network";
        const message = ax.response?.data?.message ?? ax.message ?? "Request failed";
        setErr(`Failed to create product (${status}): ${message}`);
      } else if (error instanceof Error) {
        setErr(`Failed to create product: ${error.message}`);
      } else {
        setErr("Failed to create product");
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white border rounded p-6 shadow">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Add Product</h1>
      {msg && <div className="mb-3 text-green-600">{msg}</div>}
      {err && <div className="mb-3 text-red-600">{err}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Name</label>
          <input {...register("name")} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Description</label>
          <textarea {...register("description")} className="w-full border rounded px-3 py-2" rows={4} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Price</label>
            <input type="number" step="0.01" {...register("price")} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">MRP</label>
            <input type="number" step="0.01" {...register("mrp")} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">DP</label>
            <input type="number" step="0.01" {...register("dp")} className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Category</label>
          <input {...register("category")} className="w-full border rounded px-3 py-2" />
        </div>

        {/* Stylish upload control */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Image File</label>

          {/* Hidden native input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              // update RHF and preview
              const fileList = e.target.files as FileList;
              setValue("imageFile", fileList, { shouldValidate: true });
              onFileChange(e);
            }}
            className="hidden"
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition shadow-sm"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M5 20h14a1 1 0 0 0 1-1v-8h-2v7H6V6h7V4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1Zm7-11v2h3l-4 4-4-4h3V9h2Z" />
              </svg>
              Choose Image
            </button>

            <div className="text-sm text-gray-700 truncate max-w-[320px]">
              {selectedFileName ? selectedFileName : "No file selected"}
            </div>

            {selectedFileName && (
              <button
                type="button"
                onClick={clearImage}
                className="ml-2 text-red-600 hover:text-red-700 text-sm underline"
                aria-label="Remove image"
              >
                Remove
              </button>
            )}
          </div>

          {preview && (
            <div className="relative mt-3 inline-block">
              <img src={preview} alt="Preview" className="h-40 w-40 rounded border object-cover" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-white text-red-600 border border-red-300 rounded-full w-6 h-6 flex items-center justify-center shadow"
                aria-label="Remove image"
                title="Remove image"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="pt-2">
          <button
            disabled={isSubmitting}
            type="submit"
            className={`px-4 py-2 rounded text-white ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSubmitting ? "Saving..." : "Create Product"}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <button
          type="button"
          className="text-sm text-gray-600 underline"
          onClick={() => {
            setValue("name", "Sample Product");
            setValue("description", "This is a sample product description with sufficient length.");
            setValue("price", "149.99");
            setValue("category", "Wellness");
            setValue("mrp", "199.99");
            setValue("dp", "129.99");
          }}
        >
          Fill sample (except image)
        </button>
      </div>
    </div>
  );
}
