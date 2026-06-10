import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, ImageIcon, FileText, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  error?: string;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  maxFiles?: number;
  label?: string;
  hint?: string;
  error?: string;
  value?: UploadedFile[];
  onChange?: (files: UploadedFile[]) => void;
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(file: File) {
  return file.type.startsWith('image/');
}

export function FileUpload({
  accept = 'image/*',
  multiple = true,
  maxSizeMB = 10,
  maxFiles = 10,
  label,
  hint,
  error,
  value = [],
  onChange,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback(
    (rawFiles: FileList | null) => {
      if (!rawFiles) return;
      const maxBytes = maxSizeMB * 1024 * 1024;

      const newFiles: UploadedFile[] = Array.from(rawFiles)
        .slice(0, maxFiles - value.length)
        .map((file) => {
          const id = `${file.name}-${Date.now()}-${Math.random()}`;
          const tooLarge = file.size > maxBytes;
          const preview = isImage(file) && !tooLarge ? URL.createObjectURL(file) : undefined;
          return {
            id,
            file,
            preview,
            error: tooLarge ? `File exceeds ${maxSizeMB}MB limit` : undefined,
          };
        });

      onChange?.([...value, ...newFiles]);
    },
    [value, maxFiles, maxSizeMB, onChange],
  );

  const removeFile = (id: string) => {
    const updated = value.filter((f) => f.id !== id);
    const removed = value.find((f) => f.id === id);
    if (removed?.preview) URL.revokeObjectURL(removed.preview);
    onChange?.(updated);
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles],
  );

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);

  return (
    <div className={cn('w-full', className)}>
      {label && <p className="label-luxury mb-2">{label}</p>}

      {/* Drop zone */}
      <div
        className={cn(
          'relative border-2 border-dashed transition-colors duration-200 cursor-pointer',
          isDragging ? 'border-charcoal-600 bg-charcoal-50' : 'border-charcoal-200 hover:border-charcoal-400',
          error && 'border-red-300',
        )}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Upload files"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => processFiles(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <Upload className="h-6 w-6 text-charcoal-300 mb-3" />
          <p className="text-sm text-charcoal-600 font-body">
            <span className="text-charcoal-900 font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-charcoal-400 font-body mt-1">
            {hint || `${accept.replace('image/*', 'PNG, JPG, WEBP')} — up to ${maxSizeMB}MB each`}
          </p>
          {maxFiles > 1 && (
            <p className="text-xs text-charcoal-300 font-body mt-0.5">
              {value.length}/{maxFiles} files
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-600 font-body flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}

      {/* Preview grid */}
      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          <AnimatePresence>
            {value.map((f) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative group"
              >
                <div className={cn(
                  'aspect-square overflow-hidden bg-charcoal-50 flex items-center justify-center',
                  f.error && 'border border-red-200',
                )}>
                  {f.preview ? (
                    <img src={f.preview} alt={f.file.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 p-2">
                      {isImage(f.file) ? (
                        <ImageIcon className="h-5 w-5 text-charcoal-400" />
                      ) : (
                        <FileText className="h-5 w-5 text-charcoal-400" />
                      )}
                      {f.error && <AlertCircle className="h-3.5 w-3.5 text-red-500" />}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-charcoal-900 text-ivory flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${f.file.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
                <p className="mt-1 text-2xs text-charcoal-400 font-body truncate">{formatBytes(f.file.size)}</p>
                {f.error && <p className="text-2xs text-red-500 font-body">{f.error}</p>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
