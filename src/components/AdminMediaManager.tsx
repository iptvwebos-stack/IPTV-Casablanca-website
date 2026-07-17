import React, { useState, useEffect, useRef } from "react";
import { Image as ImageIcon, Upload, RefreshCw, Download, Info, CheckCircle2, History, RotateCcw, X, Check } from "lucide-react";

interface MediaItem {
  logicalName: string;
  filename: string;
  targetWidth: number;
  targetHeight: number;
  actualWidth: number;
  actualHeight: number;
  size: number;
  format: string;
  backups: string[];
}

export default function AdminMediaManager() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  // Settings state
  const [outputFormat, setOutputFormat] = useState("original");
  
  // States for uploading and modal
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [previewData, setPreviewData] = useState<any>(null);
  const [uploadResult, setUploadResult] = useState<{ [key: string]: any }>({});
  
  const [showHistoryModal, setShowHistoryModal] = useState<string | null>(null);
  
  // Image cache buster
  const [cacheBuster, setCacheBuster] = useState(Date.now());

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setMediaList(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes === 0 || !bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, logicalName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Le fichier dépasse 10 Mo.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Format non supporté. Veuillez utiliser JPG, PNG ou WEBP.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("outputFormat", outputFormat);

    setUploading({ ...uploading, [logicalName]: true });
    
    try {
      const res = await fetch(`/api/media/${logicalName}/preview`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        setPreviewData({ logicalName, ...data });
      } else {
        alert(data.error || "Erreur de génération de l'aperçu");
      }
    } catch (err) {
      alert("Erreur de connexion");
    }
    
    setUploading({ ...uploading, [logicalName]: false });
    if (fileInputRefs.current[logicalName]) {
      fileInputRefs.current[logicalName]!.value = "";
    }
  };

  const confirmUpload = async () => {
    if (!previewData) return;
    const { logicalName, tempFilename, reduction, newSize, oldSize } = previewData;
    
    setUploading({ ...uploading, [logicalName]: true });
    try {
      const res = await fetch(`/api/media/${logicalName}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempFilename })
      });
      if (res.ok) {
        setUploadResult({ ...uploadResult, [logicalName]: { reduction, newSize, oldSize } });
        setCacheBuster(Date.now());
        fetchMedia();
        setPreviewData(null);
        setTimeout(() => {
          setUploadResult((prev) => {
            const next = { ...prev };
            delete next[logicalName];
            return next;
          });
        }, 5000);
      } else {
        alert("Erreur lors de la confirmation");
      }
    } catch (err) {
      alert("Erreur de connexion");
    }
    setUploading({ ...uploading, [logicalName]: false });
  };

  const cancelUpload = () => {
    setPreviewData(null);
  };

  const restoreBackup = async (logicalName: string, backupFilename: string) => {
    if (!confirm("Voulez-vous vraiment restaurer cette sauvegarde ?")) return;
    
    try {
      const res = await fetch(`/api/media/${logicalName}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backupFilename })
      });
      
      if (res.ok) {
        alert("Restauration réussie !");
        setCacheBuster(Date.now());
        fetchMedia();
        setShowHistoryModal(null);
      } else {
        alert("Erreur lors de la restauration");
      }
    } catch (err) {
      alert("Erreur de connexion");
    }
  };

  const filteredMedia = mediaList.filter(m => 
    m.logicalName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-emerald-400" />
            Gestionnaire de Médias Intelligent
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Redimensionnement, optimisation et sauvegarde 100% automatiques.
          </p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select 
            value={outputFormat} 
            onChange={(e) => setOutputFormat(e.target.value)}
            className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
          >
            <option value="original">Format Original</option>
            <option value="webp">Forcer WebP</option>
            <option value="avif">Forcer AVIF</option>
          </select>
          <input
            type="text"
            placeholder="Rechercher une image..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
          />
          <button 
            onClick={fetchMedia}
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-all"
            title="Rafraîchir"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMedia.map((media) => (
          <div key={media.logicalName} className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-xl">
            {/* Image Preview */}
            <div className="relative h-48 bg-black/60 border-b border-white/5 flex items-center justify-center p-4">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333), repeating-linear-gradient(45deg, #333 25%, #222 25%, #222 75%, #333 75%, #333)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
              <img 
                src={`/${media.filename}?v=${cacheBuster}`} 
                alt={media.logicalName}
                className="max-h-full max-w-full object-contain relative z-10 drop-shadow-2xl rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM1NTUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIvPjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIyIi8+PHBhdGggZD0ibTIxIDE1LTMuMDgtMy4wOGExLjIgMS4yIDAgMCAwLTEuNzEgMGwtNS42NyA1LjY3Ii8+PHBhdGggZD0ibTEwIDE1IDUtNWExLjIgMS4yIDAgMCAxIDEuNzEgMGwyLjI5IDIuMyIvPjwvc3ZnPg==';
                }}
              />
              
              <div className="absolute top-2 right-2 flex gap-1 z-20">
                <span className="bg-black/80 text-white text-[10px] font-mono px-2 py-1 rounded-md border border-white/10">
                  {media.targetWidth}x{media.targetHeight}
                </span>
                <span className="bg-black/80 text-white text-[10px] font-mono px-2 py-1 rounded-md border border-white/10 uppercase">
                  {media.format}
                </span>
              </div>
            </div>

            {/* Info and Actions */}
            <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-white text-base capitalize flex items-center gap-2">
                  {media.logicalName.replace(/-/g, ' ')}
                  {uploadResult[media.logicalName] && (
                    <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="h-3 w-3" /> Succès
                    </span>
                  )}
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1">/{media.filename}</p>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="bg-slate-950/50 p-2 rounded-lg border border-white/5">
                    <span className="block text-[10px] text-slate-500 mb-0.5">Poids Actuel</span>
                    <span className="font-mono">{formatSize(media.size)}</span>
                  </div>
                  <div className="bg-slate-950/50 p-2 rounded-lg border border-white/5">
                    <span className="block text-[10px] text-slate-500 mb-0.5">Sauvegardes</span>
                    <span className="font-mono">{media.backups.length} / 5</span>
                  </div>
                </div>

                {uploadResult[media.logicalName] && (
                  <div className="mt-3 bg-emerald-950/30 border border-emerald-500/20 rounded-lg p-3 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-400">Poids avant:</span>
                      <span className="font-mono text-slate-300">{formatSize(uploadResult[media.logicalName].oldSize)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-400">Poids après:</span>
                      <span className="font-mono text-emerald-400 font-bold">{formatSize(uploadResult[media.logicalName].newSize)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-white/5">
                      <span className="text-slate-400">Compression:</span>
                      <span className="font-bold text-amber-400">{(uploadResult[media.logicalName].reduction > 0 ? "-" : "+")}{Math.abs(uploadResult[media.logicalName].reduction)}%</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-white/5">
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden"
                  ref={el => fileInputRefs.current[media.logicalName] = el}
                  onChange={(e) => handleFileSelect(e, media.logicalName)}
                />
                
                <button 
                  onClick={() => fileInputRefs.current[media.logicalName]?.click()}
                  disabled={uploading[media.logicalName]}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading[media.logicalName] ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Remplacer
                </button>

                <button 
                  onClick={() => setShowHistoryModal(media.logicalName)}
                  disabled={media.backups.length === 0}
                  className="bg-white/5 hover:bg-white/10 text-slate-300 disabled:text-slate-600 disabled:bg-transparent text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all border border-white/5"
                  title="Historique & Restaurer"
                >
                  <History className="h-4 w-4" />
                </button>
                
                <a 
                  href={`/${media.filename}`}
                  download={media.filename}
                  className="bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all border border-white/5"
                  title="Télécharger"
                >
                  <Download className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && !loading && (
        <div className="text-center py-12 bg-slate-900 border border-white/5 rounded-2xl">
          <Info className="h-8 w-8 text-slate-500 mx-auto mb-3" />
          <h3 className="text-slate-300 font-semibold mb-1">Aucune image trouvée</h3>
          <p className="text-slate-500 text-sm">Vérifiez vos critères de recherche.</p>
        </div>
      )}

      {/* Preview Modal */}
      {previewData && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f172a] border border-white/15 p-6 rounded-3xl max-w-4xl w-full shadow-2xl my-8">
            <h3 className="text-2xl font-bold text-white mb-6">Aperçu avant validation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Old Image */}
              <div className="space-y-4">
                <h4 className="text-slate-400 font-semibold flex items-center justify-between">
                  Ancienne image
                  <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">{previewData.oldFormat}</span>
                </h4>
                <div className="aspect-video bg-black/50 rounded-xl border border-white/10 flex items-center justify-center p-2 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333), repeating-linear-gradient(45deg, #333 25%, #222 25%, #222 75%, #333 75%, #333)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
                  {previewData.oldImageBase64 ? (
                    <img src={previewData.oldImageBase64} alt="Ancienne" className="max-w-full max-h-full object-contain relative z-10" />
                  ) : (
                    <span className="text-slate-500 relative z-10">Aucune image existante</span>
                  )}
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Poids :</span>
                    <span className="text-white font-mono">{formatSize(previewData.oldSize)}</span>
                  </div>
                </div>
              </div>

              {/* New Image */}
              <div className="space-y-4">
                <h4 className="text-emerald-400 font-semibold flex items-center justify-between">
                  Nouvelle image
                  <span className="text-xs bg-emerald-900/50 border border-emerald-500/20 px-2 py-1 rounded text-emerald-400">{previewData.newFormat}</span>
                </h4>
                <div className="aspect-video bg-black/50 rounded-xl border border-emerald-500/30 flex items-center justify-center p-2 relative overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333), repeating-linear-gradient(45deg, #333 25%, #222 25%, #222 75%, #333 75%, #333)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
                  <img src={previewData.newImageBase64} alt="Nouvelle" className="max-w-full max-h-full object-contain relative z-10" />
                  
                  <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 text-xs font-bold px-2 py-1 rounded z-20">
                    {previewData.width}x{previewData.height}
                  </div>
                </div>
                <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/20 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Poids optimisé :</span>
                    <span className="text-emerald-400 font-bold font-mono">{formatSize(previewData.newSize)}</span>
                  </div>
                  {previewData.oldSize > 0 && (
                    <div className="flex justify-between border-t border-white/5 pt-2">
                      <span className="text-slate-400">Compression :</span>
                      <span className="text-amber-400 font-bold font-mono">
                        {(previewData.reduction > 0 ? "-" : "+")}{Math.abs(previewData.reduction)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={cancelUpload}
                disabled={uploading[previewData.logicalName]}
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all disabled:opacity-50"
              >
                Annuler
              </button>
              <button 
                onClick={confirmUpload}
                disabled={uploading[previewData.logicalName]}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {uploading[previewData.logicalName] ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Check className="h-5 w-5" />
                )}
                Valider et Remplacer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-white/15 p-6 rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="h-5 w-5 text-amber-500" />
                Historique: {showHistoryModal}
              </h3>
              <button 
                onClick={() => setShowHistoryModal(null)}
                className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {mediaList.find(m => m.logicalName === showHistoryModal)?.backups.map((backup, idx) => {
                // Parse timestamp from backup string: logicalName_123456789_filename.ext
                const match = backup.match(/_(\d+)_/);
                const date = match ? new Date(parseInt(match[1])).toLocaleString('fr-FR') : "Date inconnue";
                return (
                  <div key={backup} className="flex items-center justify-between bg-slate-900 border border-white/5 p-3 rounded-xl">
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-white truncate w-48 sm:w-64">Version {idx + 1}</p>
                      <p className="text-xs text-slate-500 mt-1">{date}</p>
                    </div>
                    <button
                      onClick={() => restoreBackup(showHistoryModal, backup)}
                      className="shrink-0 flex items-center gap-1.5 bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-sky-500/20 transition-all"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restaurer
                    </button>
                  </div>
                );
              })}
              
              {mediaList.find(m => m.logicalName === showHistoryModal)?.backups.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-sm">
                  Aucune sauvegarde disponible
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
