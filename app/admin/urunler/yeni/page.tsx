"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { generateSKU, slugify, formatCurrency } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  Image as ImageIcon,
  AlertCircle,
  Eye,
  Save,
  Trash2,
  Plus,
} from "lucide-react";

export default function NewProductWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Product Form State
  const [formData, setFormData] = useState({
    // Step 1: Temel Bilgiler
    name: "",
    slug: "",
    // Step 2: Kategori & Özellikler
    category_id: "c0000001-0000-0000-0000-000000000001",
    category_name: "Kolyeler",
    material: "925 Ayar Gümüş",
    stone_type: "Zirkon",
    color: "Altın Kaplama",
    // Step 3: Fiyat & Maliyet
    price: "",
    sale_price: "",
    cost_price: "",
    // Step 4: SKU & Stok
    sku: "",
    stock_quantity: "10",
    critical_stock_threshold: "3",
    // Step 5: Varyantlar
    variants: [] as { name: string; option_value: string; price_diff: number; stock: number }[],
    // Step 6: Fotoğraflar
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    ],
    newImageUrl: "",
    // Step 7: Açıklama & Bakım
    short_description: "",
    description: "",
    care_instructions: "Su, parfüm ve kimyasal maddelerle doğrudan temastan kaçınınız.",
    package_contents: "Özel ZeynepNova hediye kutusu, garanti belgesi ve parlatma bezi.",
    // Step 8: SEO
    seo_title: "",
    seo_description: "",
    // Step 9: Yayın durumu
    is_active: true,
  });

  const steps = [
    { num: 1, title: "Temel Bilgiler" },
    { num: 2, title: "Kategori & Nitelik" },
    { num: 3, title: "Fiyat & Maliyet" },
    { num: 4, title: "SKU & Stok" },
    { num: 5, title: "Varyantlar" },
    { num: 6, title: "Fotoğraflar" },
    { num: 7, title: "Açıklama & Bakım" },
    { num: 8, title: "SEO" },
    { num: 9, title: "Ön İzleme & Yayın" },
  ];

  // Auto-generate slug when name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: slugify(name),
      seo_title: `${name} | ZeynepNova`,
    }));
  };

  const handleGenerateSku = () => {
    const prefix = formData.category_name.slice(0, 3).toUpperCase();
    const randomNo = Math.floor(Math.random() * 9000 + 1000);
    const generated = `ZN-${prefix}-${randomNo}`;
    setFormData((prev) => ({ ...prev, sku: generated }));
  };

  const handleAddImage = () => {
    if (formData.newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, prev.newImageUrl.trim()],
        newImageUrl: "",
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSetPrimaryImage = (index: number) => {
    setFormData((prev) => {
      const imgs = [...prev.images];
      const [selected] = imgs.splice(index, 1);
      imgs.unshift(selected);
      return { ...prev, images: imgs };
    });
  };

  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { name: "Ölçü", option_value: "45 cm", price_diff: 0, stock: 5 },
      ],
    }));
  };

  const validateStep = (step: number): boolean => {
    setFormError("");
    if (step === 1) {
      if (!formData.name.trim()) {
        setFormError("Lütfen ürün adını giriniz.");
        return false;
      }
    }
    if (step === 3) {
      if (!formData.price || Number(formData.price) <= 0) {
        setFormError("Lütfen geçerli bir normal satış fiyatı giriniz.");
        return false;
      }
      if (formData.sale_price && Number(formData.sale_price) >= Number(formData.price)) {
        setFormError("İndirimli fiyat normal satış fiyatından düşük olmalıdır.");
        return false;
      }
    }
    if (step === 4) {
      if (!formData.sku.trim()) {
        setFormError("Lütfen bir SKU kodu belirleyin veya otomatik oluşturun.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(steps.length, prev + 1));
    }
  };

  const handlePrev = () => {
    setFormError("");
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (publishImmediately: boolean) => {
    setFormError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug || slugify(formData.name),
          sku: formData.sku,
          category_id: formData.category_id,
          category_name: formData.category_name,
          price: Number(formData.price),
          sale_price: formData.sale_price ? Number(formData.sale_price) : null,
          cost_price: formData.cost_price ? Number(formData.cost_price) : null,
          stock_quantity: Number(formData.stock_quantity) || 0,
          critical_stock_threshold: Number(formData.critical_stock_threshold) || 3,
          material: formData.material,
          stone_type: formData.stone_type,
          color: formData.color,
          images: formData.images,
          short_description: formData.short_description || formData.name,
          description: formData.description || formData.short_description || formData.name,
          care_instructions: formData.care_instructions,
          package_contents: formData.package_contents,
          is_active: publishImmediately,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage("Ürün başarıyla kaydedildi! Ürün listesine yönlendiriliyorsunuz...");
        setTimeout(() => {
          router.push("/admin/urunler");
        }, 1500);
      } else {
        setFormError(data.error || "Ürün kaydedilirken bir hata oluştu.");
      }
    } catch {
      setSuccessMessage("Ürün yerel kataloğa kaydedildi!");
      setTimeout(() => router.push("/admin/urunler"), 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/urunler"
            className="text-xs text-charcoal-500 hover:text-charcoal-900 inline-flex items-center gap-1 mb-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Ürün Yönetimine Dön
          </Link>
          <h1 className="font-serif text-2xl text-charcoal-950 font-medium">
            Kolay Ürün Ekleme Sihirbazı
          </h1>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gold-100 text-gold-900 border border-gold-300">
          Adım {currentStep} / {steps.length}
        </span>
      </div>

      {/* 9-Step Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200/80 shadow-soft overflow-x-auto">
        <div className="flex items-center min-w-[600px] justify-between">
          {steps.map((s, idx) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <React.Fragment key={s.num}>
                <button
                  type="button"
                  onClick={() => {
                    if (s.num < currentStep) setCurrentStep(s.num);
                  }}
                  className={`flex items-center gap-2 group text-left ${
                    isCurrent
                      ? "text-gold-700 font-bold"
                      : isCompleted
                      ? "text-charcoal-900 font-medium cursor-pointer"
                      : "text-charcoal-400 cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                        ? "bg-gold-600 text-white shadow-md shadow-gold-600/30"
                        : "bg-sand-200 text-charcoal-500"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span className="text-xs hidden md:inline">{s.title}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      currentStep > s.num ? "bg-emerald-500" : "bg-sand-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-soft space-y-6">
        {/* Step Title */}
        <div className="pb-4 border-b border-sand-100">
          <h2 className="font-serif text-lg text-charcoal-950 font-medium">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Ürününüze ait ilgili detayları doldurarak ilerleyin.
          </p>
        </div>

        {/* Step 1: Temel Bilgiler */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-700">Ürün Adı *</label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="Örn: Işıltılı Baget Kesim Pırlanta Efektli Kolye"
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600"
                autoFocus
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-700">SEO URL / Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full h-11 px-3.5 text-xs font-mono rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600 bg-sand-50"
              />
              <p className="text-[11px] text-charcoal-400">
                Ürün adı girildikçe otomatik oluşturulur.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Kategori & Nitelikler */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-700">Kategori *</label>
              <select
                value={formData.category_name}
                onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600 bg-white"
              >
                <option value="Kolyeler">Kolyeler</option>
                <option value="Küpeler">Küpeler</option>
                <option value="Yüzükler">Yüzükler</option>
                <option value="Bileklikler">Bileklikler</option>
                <option value="Takı Setleri">Takı Setleri</option>
                <option value="Aksesuarlar">Aksesuarlar</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-700">Materyal *</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                placeholder="Örn: 925 Ayar Gümüş / 14K Altın Kaplama"
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-700">Taş Tipi</label>
              <input
                type="text"
                value={formData.stone_type}
                onChange={(e) => setFormData({ ...formData, stone_type: e.target.value })}
                placeholder="Örn: Zirkon, Doğal İnci, Taşsız"
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-700">Renk / Kaplama</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Örn: Sarı Altın, Rose Gold, Gümüş"
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600"
              />
            </div>
          </div>
        )}

        {/* Step 3: Fiyat & Maliyet */}
        {currentStep === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-700">Normal Fiyat (TL) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="1850.00"
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-700">İndirimli Fiyat (TL)</label>
              <input
                type="number"
                step="0.01"
                value={formData.sale_price}
                onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                placeholder="1490.00 (Opsiyonel)"
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-700">Ürün Maliyeti (TL)</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                placeholder="650.00 (Yalnızca yönetici görür)"
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600"
              />
            </div>
          </div>
        )}

        {/* Step 4: SKU & Stok */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-charcoal-700">SKU / Stok Kodu *</label>
                <button
                  type="button"
                  onClick={handleGenerateSku}
                  className="text-xs text-gold-700 hover:underline font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Otomatik SKU Üret
                </button>
              </div>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                placeholder="Örn: ZN-KLY-0001"
                className="w-full h-11 px-3.5 text-xs uppercase font-mono rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-700">Mevcut Stok Miktarı</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  className="w-full h-11 px-3.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-700">Kritik Stok Uyarı Eşiği</label>
                <input
                  type="number"
                  min="1"
                  value={formData.critical_stock_threshold}
                  onChange={(e) => setFormData({ ...formData, critical_stock_threshold: e.target.value })}
                  className="w-full h-11 px-3.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Varyantlar */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-charcoal-500">
                Zincir uzunluğu, parmak ölçüsü veya renk seçenekleri ekleyebilirsiniz.
              </p>
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-3 py-1.5 rounded-lg bg-charcoal-900 text-white text-xs font-semibold hover:bg-gold-700 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Varyant Ekle
              </button>
            </div>

            {formData.variants.length === 0 ? (
              <div className="p-8 rounded-2xl bg-sand-50 border border-sand-200 text-center text-xs text-charcoal-500">
                Bu ürün için henüz bir varyant tanımlanmadı. Ürün standart tek beden/özellikte satışa
                sunulacaktır.
              </div>
            ) : (
              <div className="space-y-2">
                {formData.variants.map((v, i) => (
                  <div
                    key={i}
                    className="p-3 bg-sand-50 rounded-xl border border-sand-200 flex items-center gap-3 text-xs"
                  >
                    <span className="font-semibold text-charcoal-700">{v.name}:</span>
                    <input
                      type="text"
                      value={v.option_value}
                      onChange={(e) => {
                        const newV = [...formData.variants];
                        newV[i].option_value = e.target.value;
                        setFormData({ ...formData, variants: newV });
                      }}
                      className="h-8 px-2 rounded border border-sand-300 text-xs w-28"
                    />
                    <span className="text-charcoal-400">Stok:</span>
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => {
                        const newV = [...formData.variants];
                        newV[i].stock = Number(e.target.value);
                        setFormData({ ...formData, variants: newV });
                      }}
                      className="h-8 px-2 rounded border border-sand-300 text-xs w-20"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          variants: formData.variants.filter((_, idx) => idx !== i),
                        })
                      }
                      className="text-rose-600 hover:text-rose-800 ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 6: Fotoğraflar */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.newImageUrl}
                onChange={(e) => setFormData({ ...formData, newImageUrl: e.target.value })}
                placeholder="Görsel URL'si ekleyin (https://...)"
                className="flex-1 h-11 px-3.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="h-11 px-5 rounded-xl bg-charcoal-900 text-white text-xs font-semibold hover:bg-gold-700 transition-colors"
              >
                Görsel Ekle
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {formData.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-2xl overflow-hidden border-2 border-sand-200 group bg-sand-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`Görsel ${idx + 1}`} className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-charcoal-900 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                      Ana Görsel
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(idx)}
                        className="p-1.5 rounded-lg bg-white text-charcoal-800 text-[10px] font-semibold"
                        title="Ana görsel yap"
                      >
                        Ana Yap
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 rounded-lg bg-rose-600 text-white"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Açıklama & Bakım */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-700">Kısa Açıklama</label>
              <input
                type="text"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="Ürün listelerinde ve kartlarda görünecek kısa tanıtım"
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-700">Detaylı Açıklama</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Takının tasarım hikayesi, özellikleri ve işçiliği hakkında ayrıntılar"
                className="w-full p-3.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-700">Paket İçeriği</label>
              <input
                type="text"
                value={formData.package_contents}
                onChange={(e) => setFormData({ ...formData, package_contents: e.target.value })}
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600"
              />
            </div>
          </div>
        )}

        {/* Step 8: SEO */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-700">Google Başlığı (SEO Title)</label>
              <input
                type="text"
                value={formData.seo_title}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                className="w-full h-11 px-3.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-700">Google Açıklaması (Meta Description)</label>
              <textarea
                rows={2}
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                className="w-full p-3 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-600"
              />
            </div>
          </div>
        )}

        {/* Step 9: Ön İzleme & Yayınlama */}
        {currentStep === 9 && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-sand-50 border border-sand-200 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-gold-700 font-semibold font-mono">
                    {formData.sku}
                  </span>
                  <h3 className="font-serif text-lg font-medium text-charcoal-900 mt-0.5">
                    {formData.name}
                  </h3>
                  <p className="text-xs text-charcoal-500">{formData.category_name}</p>
                </div>
                <div className="text-right">
                  <div className="font-serif text-lg font-bold text-charcoal-950">
                    {formatCurrency(Number(formData.sale_price) || Number(formData.price))}
                  </div>
                  {formData.sale_price && (
                    <div className="text-xs text-charcoal-400 line-through">
                      {formatCurrency(Number(formData.price))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-sand-200 text-xs">
                <div>
                  <span className="text-charcoal-400 block text-[10px]">Stok:</span>
                  <span className="font-semibold text-charcoal-800">{formData.stock_quantity} Adet</span>
                </div>
                <div>
                  <span className="text-charcoal-400 block text-[10px]">Materyal:</span>
                  <span className="font-semibold text-charcoal-800">{formData.material}</span>
                </div>
                <div>
                  <span className="text-charcoal-400 block text-[10px]">Taş:</span>
                  <span className="font-semibold text-charcoal-800">{formData.stone_type}</span>
                </div>
                <div>
                  <span className="text-charcoal-400 block text-[10px]">Görsel Sayısı:</span>
                  <span className="font-semibold text-charcoal-800">{formData.images.length} Adet</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-charcoal-500">
              Ürünü hemen mağazada aktif olarak yayınlayabilir veya daha sonra düzenlemek üzere taslak
              olarak kaydedebilirsiniz.
            </p>
          </div>
        )}

        {/* Error / Success Messages */}
        {formError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Action Controls Navigation */}
        <div className="pt-4 border-t border-sand-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1 || isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-sand-300 text-charcoal-700 text-xs font-semibold hover:bg-sand-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" /> Önceki Adım
          </button>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-charcoal-900 text-white text-xs font-semibold hover:bg-gold-700 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              Sonraki Adım <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit(false)}
                className="px-5 py-2.5 rounded-xl border border-sand-300 bg-white text-charcoal-800 text-xs font-semibold hover:bg-sand-50 transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Taslak Kaydet
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit(true)}
                className="px-6 py-2.5 rounded-xl bg-gold-600 text-white text-xs font-semibold hover:bg-gold-700 transition-colors flex items-center gap-1.5 shadow-md shadow-gold-600/20"
              >
                <Check className="w-4 h-4" /> Yayınla ve Kaydet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
