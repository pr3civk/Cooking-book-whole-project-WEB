import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Upload, X, Link as LinkIcon } from "lucide-react";
import { cn } from "@/utils/tailwind";
import { normalizeImageUrl } from "@/utils/image";

type ImageUploadProps = {
  value?: string | File;
  onChange: (value: string | File | undefined) => void;
};

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onChange(file);
      }
    },
    [onChange]
  );

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleUrlSubmit = useCallback(() => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
    }
  }, [urlInput, onChange]);

  const handleRemove = useCallback(() => {
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onChange]);

  // Show preview for File or URL
  const displayUrl = value instanceof File ? preview : (value ? normalizeImageUrl(value) : null);

  if (displayUrl) {
    return (
      <div className="relative">
        <img
          src={displayUrl}
          alt="Recipe"
          className="aspect-video w-full rounded-lg object-cover"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon-sm"
          className="absolute right-2 top-2"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
        {value instanceof File && (
          <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1">
            <Typography variant="standardSm" className="text-white">
              {value.name}
            </Typography>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === "upload" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("upload")}
        >
          <Upload className="mr-1 h-4 w-4" />
          Upload
        </Button>
        <Button
          type="button"
          variant={mode === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("url")}
        >
          <LinkIcon className="mr-1 h-4 w-4" />
          URL
        </Button>
      </div>

      {mode === "upload" ? (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={handleUploadClick}
            className={cn(
              "flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors hover:border-primary hover:bg-accent"
            )}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <Typography variant="standardSm" className="text-muted-foreground">
              Click to upload or drag and drop
            </Typography>
          </button>
        </>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="Enter image URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <Button type="button" onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
