import React, { useState } from "react";
import { Image as ImageIcon, Save, Check, AlertCircle } from "lucide-react";

interface AdminMediaManagerProps {
  mediaLinks: Record<string, string>;
  setMediaLinks: (links: Record<string, string>) => void;
}

export default function AdminMediaManager({ mediaLinks, setMediaLinks }: AdminMediaManagerProps) {
  const [localLinks, setLocalLinks] = useState<Record<string, string>>(mediaLinks);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (key: string, value: string) => {
    setLocalLinks((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const validateUrls = () => {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg', '.gif'];
    for (const url of Object.values(localLinks)) {
      if (!url) continue; // Skip empty
      try {
        const parsed = new URL(url);
        const path = parsed.pathname.toLowerCase();
        const hasValidExt = validExtensions.some(ext => path.endsWith(ext));
        if (!hasValidExt) {
          // Sometimes external URLs don't end with an extension (e.g. image hosting APIs).
          // We'll just show a warning or enforce it strictly since the user requested it.
          // User said: "en respectant les formats acceptés ( jpg, png, webp, avif, svg, gif)"
          // So let's strictly enforce it or just check if the URL contains the extension
          const urlLower = url.toLowerCase();
          const containsExt = validExtensions.some(ext => urlLower.includes(ext));
          if (!containsExt) {
            return `L'URL suivante ne semble pas contenir de format d'image valide (jpg, png, webp, avif, svg, gif) :\n${url}`;
          }
        }
      } catch (e) {
        return `URL invalide : ${url}`;
      }
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validateUrls();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/data/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localLinks)
      });
      if (res.ok) {
        setMediaLinks(localLinks);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError("Erreur lors de la sauvegarde côté serveur.");
      }
    } catch (e) {
      console.error(e);
      setError("Erreur de connexion au serveur.");
    }
    setSaving(false);
  };

  const mediaItems = [
    { key: "logo", label: "Logo principal" },
    { key: "banner", label: "Bannière Accueil" },
    { key: "samsung", label: "Logo Samsung" },
    { key: "lg", label: "Logo LG" },
    { key: "android", label: "Logo Android" },
    { key: "satellite", label: "Logo Satellite" },
    { key: "xciptvLogo", label: "Logo XCIPTV" },
    { key: "xciptvAccueil", label: "Image Accueil XCIPTV" },
    { key: "xciptvIdentifiants", label: "Image Identifiants XCIPTV" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-white/10 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-emerald-500" />
            Gestionnaire de Médias Externes
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Modifiez les liens des images (formats acceptés : jpg, png, webp, avif, svg, gif).
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shrink-0"
        >
          {saving ? (
            <span className="animate-pulse">Sauvegarde...</span>
          ) : saved ? (
            <>
              <Check className="h-5 w-5" />
              Sauvegardé
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Sauvegarder
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-200">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm whitespace-pre-wrap">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {mediaItems.map((item) => (
          <div key={item.key} className="bg-slate-900 border border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 items-center sm:items-start">
            <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-black/50 border border-white/5 flex items-center justify-center">
              {localLinks[item.key] ? (
                <img
                  src={localLinks[item.key]}
                  alt={item.label}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-slate-600" />
              )}
            </div>
            <div className="flex-1 space-y-2 w-full">
              <label className="block text-sm font-bold text-white">
                {item.label}
              </label>
              <input
                type="text"
                value={localLinks[item.key] || ""}
                onChange={(e) => handleInputChange(item.key, e.target.value)}
                placeholder="https://..."
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
