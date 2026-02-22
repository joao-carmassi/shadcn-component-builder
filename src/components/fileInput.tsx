/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  AlertCircleIcon,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileUpIcon,
  HeadphonesIcon,
  ImageIcon,
  VideoIcon,
  XIcon,
} from 'lucide-react';

import { formatBytes } from '@/hooks/use-file-upload';
import { Button } from '@/components/ui/button';
import { DragEvent } from 'react';

const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  if (
    fileType.includes('pdf') ||
    fileName.endsWith('.pdf') ||
    fileType.includes('word') ||
    fileName.endsWith('.doc') ||
    fileName.endsWith('.docx')
  ) {
    return <FileTextIcon className='size-4 opacity-60' />;
  } else if (
    fileType.includes('zip') ||
    fileType.includes('archive') ||
    fileName.endsWith('.zip') ||
    fileName.endsWith('.rar')
  ) {
    return <FileArchiveIcon className='size-4 opacity-60' />;
  } else if (
    fileType.includes('excel') ||
    fileName.endsWith('.xls') ||
    fileName.endsWith('.xlsx')
  ) {
    return <FileSpreadsheetIcon className='size-4 opacity-60' />;
  } else if (fileType.includes('video/')) {
    return <VideoIcon className='size-4 opacity-60' />;
  } else if (fileType.includes('audio/')) {
    return <HeadphonesIcon className='size-4 opacity-60' />;
  } else if (fileType.startsWith('image/')) {
    return <ImageIcon className='size-4 opacity-60' />;
  }
  return <FileIcon className='size-4 opacity-60' />;
};

interface ComponentProps {
  files: any[];
  isDragging: boolean;
  errors: string[];
  onDragEnter: (e: DragEvent<HTMLElement>) => void;
  onDragLeave: (e: DragEvent<HTMLElement>) => void;
  onDragOver: (e: DragEvent<HTMLElement>) => void;
  onDrop: (e: DragEvent<HTMLElement>) => void;
  onOpenFileDialog: () => void;
  onRemoveFile: (id: string) => void;
  onClearFiles: () => void;
  inputProps: any;
  maxFiles: number;
  maxSize: number;
}

export default function FileInput({
  files,
  isDragging,
  errors,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onOpenFileDialog,
  onRemoveFile,
  onClearFiles,
  inputProps,
  maxFiles,
  maxSize,
}: ComponentProps) {
  return (
    <div className='flex flex-col gap-2'>
      {/* Drop area */}
      <div
        role='button'
        onClick={onOpenFileDialog}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        data-dragging={isDragging || undefined}
        className='border-border bg-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px] shadow-xs'
      >
        <input {...inputProps} className='sr-only' aria-label='Upload files' />

        <div className='flex flex-col items-center justify-center text-center'>
          <div
            className='bg-input mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border'
            aria-hidden='true'
          >
            <FileUpIcon className='size-4 opacity-60' />
          </div>
          <p className='mb-1.5 text-sm font-medium'>Upload files</p>
          <p className='text-muted-foreground mb-2 text-xs'>
            Drag & drop or click to browse
          </p>
          {/* <div className='text-muted-foreground/70 flex flex-wrap justify-center gap-1 text-xs'>
            <span>All files</span>
            <span>∙</span>
            <span>Max {maxFiles} files</span>
            <span>∙</span>
            <span>Up to {formatBytes(maxSize)}</span>
          </div> */}
        </div>
      </div>

      {errors.length > 0 && (
        <div
          className='text-destructive flex items-center gap-1 text-xs'
          role='alert'
        >
          <AlertCircleIcon className='size-3 shrink-0' />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className='space-y-3'>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-3'>
            {files.map((file) => (
              <div
                key={file.id}
                className='bg-input flex items-center justify-between gap-2 rounded-lg border p-2 pe-3'
              >
                <div className='flex items-center gap-3 overflow-hidden'>
                  <div className='flex aspect-square size-10 shrink-0 items-center justify-center rounded border'>
                    {getFileIcon(file)}
                  </div>
                  <div className='flex min-w-0 flex-col gap-0.5'>
                    <p className='truncate text-[13px] font-medium'>
                      {file.file instanceof File
                        ? file.file.name
                        : file.file.name}
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      {formatBytes(
                        file.file instanceof File
                          ? file.file.size
                          : file.file.size,
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  size='icon'
                  variant='ghost'
                  className='text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent'
                  onClick={() => onRemoveFile(file.id)}
                  aria-label='Remove file'
                >
                  <XIcon className='size-4' aria-hidden='true' />
                </Button>
              </div>
            ))}
          </div>

          {/* Remove all files button */}
          {files.length > 1 && (
            <div>
              <Button size='sm' variant='outline' onClick={onClearFiles}>
                Remove all files
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
