"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ArrowRight,
  RefreshCw,
  FileText,
} from "lucide-react";
import { excelCsvImportService, ImportPreviewResult, ImportExecutionResult } from "@/features/products/import/excelCsvImport";

export default function BulkImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [strategy, setStrategy] = useState<"create_and_update" | "create_only" | "update_only">("create_and_update");
  const [preview, setPreview] = useState<ImportPreviewResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [executionResult, setExecutionResult] = useState<ImportExecutionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDownloadCsvTemplate = () => {
    const csvContent = excelCsvImportService.generateTemplateCsv();
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "zeynepnova_urun_sablonu.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadXlsxTemplate = () => {
    const buffer = excelCsvImportService.generateTemplateXlsx();
    const blob = new Blob([new Uint8Array(buffer)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "zeynepnova_urun_sablonu.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("");
    setExecutionResult(null);

    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const fileType = selectedFile.name.endsWith(".xlsx") || selectedFile.name.endsWith(".xls") ? "excel" : "csv";

    try {
      if (fileType === "csv") {
        const text = await selectedFile.text();
        const res = excelCsvImportService.parseAndValidate(text, "csv", selectedFile.name);
        setPreview(res);
      } else {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const res = excelCsvImportService.parseAndValidate(arrayBuffer, "excel", selectedFile.name);
        setPreview(res);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Dosya okuma hatası";
      setErrorMessage(`Dosya işlenirken hata oluştu: ${msg}`);
      setPreview(null);
    }
  };

  const handleExecuteImport = async () => {
    if (!preview || preview.validRowsCount === 0) return;

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const result = await excelCsvImportService.executeImport(preview, strategy);
      setExecutionResult(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "İçe aktarma hatası";
      setErrorMessage(`İçe aktarma sırasında hata: ${msg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header & Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/urunler"
            className="text-xs text-charcoal-500 hover:text-charcoal-900 inline-flex items-center gap-1 mb-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Ürün Yönetimine Dön
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-950 font-medium">
            Excel / CSV ile Toplu Ürün Aktarımı
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Yüzlerce takı ürününü tek bir dosyayla ekleyin, fiyatlarını ve stoklarını anında güncelleyin.
          </p>
        </div>

        {/* Template Download Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadXlsxTemplate}
            className="px-4 py-2.5 rounded-xl border border-sand-300 bg-white text-charcoal-800 text-xs font-semibold hover:bg-sand-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-600" /> Excel Şablonu İndir (.xlsx)
          </button>
          <button
            type="button"
            onClick={handleDownloadCsvTemplate}
            className="px-4 py-2.5 rounded-xl border border-sand-300 bg-white text-charcoal-800 text-xs font-semibold hover:bg-sand-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-blue-600" /> CSV Şablonu İndir
          </button>
        </div>
      </div>

      {/* Upload & Strategy Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-soft space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Drop Area */}
          <div className="lg:col-span-2 border-2 border-dashed border-sand-300 hover:border-gold-600 rounded-2xl p-8 text-center transition-colors bg-sand-50/50">
            <input
              type="file"
              id="file-upload"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer block space-y-3">
              <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center mx-auto text-gold-700">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-charcoal-900">
                {file ? file.name : "Excel (.xlsx) veya CSV dosyasını seçin ya da buraya sürükleyin"}
              </p>
              <p className="text-[11px] text-charcoal-400">
                Maksimum 5.000 satır ve 10 MB dosya boyutu desteklenir (Türkçe karakter uyumludur).
              </p>
            </label>
          </div>

          {/* Strategy Selection */}
          <div className="bg-sand-50 p-5 rounded-2xl border border-sand-200/80 space-y-3 text-xs">
            <h3 className="font-serif font-medium text-charcoal-900 text-sm">İçe Aktarma Stratejisi</h3>
            <div className="space-y-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="strategy"
                  value="create_and_update"
                  checked={strategy === "create_and_update"}
                  onChange={() => setStrategy("create_and_update")}
                  className="mt-0.5 text-gold-600 focus:ring-gold-500"
                />
                <div>
                  <span className="font-semibold text-charcoal-900 block">Yeni Ekle & Güncelle</span>
                  <span className="text-[11px] text-charcoal-500">
                    Mevcut SKU&apos;lar güncellenir, yeni SKU&apos;lar oluşturulur.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="strategy"
                  value="update_only"
                  checked={strategy === "update_only"}
                  onChange={() => setStrategy("update_only")}
                  className="mt-0.5 text-gold-600 focus:ring-gold-500"
                />
                <div>
                  <span className="font-semibold text-charcoal-900 block">Yalnızca Fiyat & Stok Güncelle</span>
                  <span className="text-[11px] text-charcoal-500">
                    Yalnızca katalogdaki mevcut SKU&apos;ları günceller.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="strategy"
                  value="create_only"
                  checked={strategy === "create_only"}
                  onChange={() => setStrategy("create_only")}
                  className="mt-0.5 text-gold-600 focus:ring-gold-500"
                />
                <div>
                  <span className="font-semibold text-charcoal-900 block">Yalnızca Yeni Ürünleri Ekle</span>
                  <span className="text-[11px] text-charcoal-500">Mevcut ürünlere dokunmaz.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Execution Results Banner */}
      {executionResult && (
        <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-soft space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-base font-semibold text-charcoal-950">
                İçe Aktarma İşlemi Başarıyla Tamamlandı
              </h3>
              <p className="text-xs text-charcoal-600">
                Toplam <strong>{executionResult.total}</strong> geçerli satır işlendi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <span className="text-charcoal-500 block">Yeni Eklenen:</span>
              <span className="text-lg font-bold text-emerald-800">{executionResult.created}</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
              <span className="text-charcoal-500 block">Güncellenen:</span>
              <span className="text-lg font-bold text-blue-800">{executionResult.updated}</span>
            </div>
            <div className="p-3 bg-sand-50 rounded-xl border border-sand-200 text-center">
              <span className="text-charcoal-500 block">Başarısız:</span>
              <span className="text-lg font-bold text-charcoal-800">{executionResult.failed}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/urunler"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gold-700 hover:underline"
            >
              Ürün Listesinde Görüntüle <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Preview Table Section */}
      {preview && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-100">
            <div>
              <h2 className="font-serif text-lg font-medium text-charcoal-950">
                Dosya Ön İzleme ve Veri Doğrulama
              </h2>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Toplam <strong>{preview.totalRows}</strong> satır okundu (
                <span className="text-emerald-700 font-bold">{preview.validRowsCount} geçerli</span>,{" "}
                <span className="text-rose-600 font-bold">{preview.invalidRowsCount} hatalı</span>).
              </p>
            </div>

            <button
              type="button"
              disabled={isProcessing || preview.validRowsCount === 0}
              onClick={handleExecuteImport}
              className="px-6 py-2.5 rounded-xl bg-charcoal-900 text-white text-xs font-semibold hover:bg-gold-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> İçe Aktarılıyor...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Geçerli Satırları İçe Aktar (
                  {preview.validRowsCount})
                </>
              )}
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-sand-200 text-charcoal-500 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Satır</th>
                  <th className="py-2.5 px-3">Durum</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Ürün Adı</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Fiyat</th>
                  <th className="py-2.5 px-3">Stok</th>
                  <th className="py-2.5 px-3">Hata / Açıklama</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {preview.rows.slice(0, 50).map((r) => (
                  <tr
                    key={r.rowNumber}
                    className={r.isValid ? "hover:bg-sand-50/50" : "bg-rose-50/50 hover:bg-rose-50"}
                  >
                    <td className="py-2.5 px-3 font-mono text-charcoal-400">{r.rowNumber}</td>
                    <td className="py-2.5 px-3">
                      {r.isValid ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Geçerli
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-semibold text-[11px]">
                          <XCircle className="w-3.5 h-3.5" /> Hatalı
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-charcoal-900">
                      {String(r.data.sku || "-")}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-charcoal-800 truncate max-w-xs">
                      {String(r.data.name || "-")}
                    </td>
                    <td className="py-2.5 px-3 text-charcoal-600">{String(r.data.category || "-")}</td>
                    <td className="py-2.5 px-3 font-semibold text-charcoal-900">
                      {String(r.data.price || "-")} ₺
                    </td>
                    <td className="py-2.5 px-3 text-charcoal-700">{String(r.data.stock_quantity ?? "-")}</td>
                    <td className="py-2.5 px-3 text-rose-600 text-[11px]">
                      {r.errors.length > 0 ? r.errors.join("; ") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
