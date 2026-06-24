type UploadProgressProps = {
  fileName: string;
  progress: number;
};

export function UploadProgress({ fileName, progress }: UploadProgressProps) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="truncate font-medium text-blue-950">{fileName}</span>
        <span className="font-semibold text-blue-700">{progress}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
