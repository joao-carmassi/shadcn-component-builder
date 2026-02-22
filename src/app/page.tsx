/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import FileInput from '@/components/fileInput';
import { TagsInput } from '@/components/tagsInput';
import { Button } from '@/components/ui/button';
import { H1 } from '@/components/ui/h1';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useEffect, useState } from 'react';

interface FileContentItem {
  originalName: string;
  type: string;
  path: string;
  append: boolean;
  content: string;
}

export default function Home() {
  const maxSize = 100 * 1024 * 1024 * 100000000;
  const maxFiles = 1000000000;
  const [form, setForm] = useState({
    name: '',
    dependencies: [] as string[],
    registryDependencies: [] as string[],
  });

  const [format, setFormat] = useState<any>(null);

  const [fileContents, setFileContents] = useState<FileContentItem[]>([]);

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    accept: '.tsx,.jsx,.ts,.js,.css',
  });

  const updateFileContent = (
    originalName: string,
    field: keyof Omit<FileContentItem, 'originalName' | 'content'>,
    value: string | boolean,
  ) => {
    setFileContents((prev) =>
      prev.map((f) =>
        f.originalName === originalName ? { ...f, [field]: value } : f,
      ),
    );
  };

  useEffect(() => {
    setFileContents((prev) =>
      prev.filter((f) => files.some((fw) => fw.file.name === f.originalName)),
    );

    files.forEach((fileWrapper) => {
      if (fileWrapper.file instanceof File) {
        const reader = new FileReader();
        reader.onload = () => {
          setFileContents((prev) => {
            const existing = prev.find(
              (f) => f.originalName === fileWrapper.file.name,
            );
            const filename = fileWrapper.file.name;
            const ext = filename.split('.').pop();
            const defaultPath =
              ext === 'css'
                ? `src/app/${filename}`
                : ext === 'ts' || ext === 'js'
                  ? `src/lib/${filename}`
                  : `src/components/ui/${filename}`;
            const filtered = prev.filter((f) => f.originalName !== filename);
            return [
              ...filtered,
              {
                originalName: filename,
                type: existing?.type ?? 'registry:file',
                path: existing?.path ?? defaultPath,
                append: existing?.append ?? false,
                content: reader.result as string,
              },
            ];
          });
        };
        reader.readAsText(fileWrapper.file);
      }
    });
  }, [files]);

  useEffect(() => {
    setFormat({
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: form.name,
      type: 'registry:style',
      dependencies: [...form.dependencies],
      registryDependencies: [...form.registryDependencies],
      files: fileContents.map(
        ({ originalName: _orig, content, append, ...item }) => ({
          ...item,
          target: item.path,
          content,
          ...(append ? { append } : {}),
        }),
      ),
    });
  }, [fileContents, form]);

  return (
    <main className='bg-background min-h-svh'>
      <section className='p-6 md:p-12 max-w-7xl mx-auto space-y-3 md:space-y-6'>
        <div className='flex flex-col items-center justify-center'>
          <H1>JSON Generator for ChadCN</H1>
        </div>
        <div className='grid gap-3 grid-cols-2 lg:grid-cols-3'>
          <div className='grid w-full items-center gap-3'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              placeholder='Name'
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className='grid w-full items-center gap-3'>
            <Label htmlFor='dependencies'>Dependencies</Label>
            <TagsInput
              id='dependencies'
              placeholder='Dependencies'
              value={form.dependencies}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, dependencies: val }))
              }
            />
          </div>
          <div className='grid w-full items-center gap-3 col-span-2 lg:col-span-1'>
            <Label htmlFor='dependencies'>Registry Dependencies</Label>
            <TagsInput
              id='registryDependencies'
              placeholder='Registry Dependencies'
              value={form.registryDependencies}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, registryDependencies: val }))
              }
            />
          </div>
        </div>
        <FileInput
          files={files}
          isDragging={isDragging}
          errors={errors}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onOpenFileDialog={openFileDialog}
          onRemoveFile={removeFile}
          onClearFiles={clearFiles}
          inputProps={getInputProps()}
          maxFiles={maxFiles}
          maxSize={maxSize}
        />
        {fileContents.length > 0 && (
          <div className='space-y-3'>
            <h2 className='text-sm font-semibold'>File metadata</h2>
            <div className='grid gap-3'>
              {fileContents.map((fc) => (
                <div
                  key={fc.originalName}
                  className='bg-card border rounded-lg p-4 space-y-3'
                >
                  <p className='text-sm font-medium truncate'>
                    {fc.originalName}
                  </p>
                  <div className='flex items-center justify-between gap-3'>
                    <div className='grid gap-1.5 w-full'>
                      <Label className='text-xs'>Type</Label>
                      <Input
                        className='h-8 text-xs max-w-full w-full'
                        value={fc.type}
                        onChange={(e) =>
                          updateFileContent(
                            fc.originalName,
                            'type',
                            e.target.value,
                          )
                        }
                        placeholder='registry:file'
                      />
                    </div>
                    <div className='grid gap-1.5 w-full'>
                      <Label className='text-xs'>Path</Label>
                      <Input
                        className='h-8 text-xs max-w-full w-full'
                        value={fc.path}
                        onChange={(e) =>
                          updateFileContent(
                            fc.originalName,
                            'path',
                            e.target.value,
                          )
                        }
                        placeholder='src/components/ui/button.tsx'
                      />
                    </div>
                    <div className='grid gap-1.5'>
                      <Label className='text-xs'>Append</Label>
                      <div className='flex items-center h-8'>
                        <input
                          type='checkbox'
                          id={`append-${fc.originalName}`}
                          checked={fc.append}
                          onChange={(e) =>
                            updateFileContent(
                              fc.originalName,
                              'append',
                              e.target.checked,
                            )
                          }
                          className='h-4 w-4 rounded border-border accent-primary cursor-pointer'
                        />
                        <label
                          htmlFor={`append-${fc.originalName}`}
                          className='ml-2 text-xs cursor-pointer select-none text-nowrap font-medium'
                        >
                          Append to target
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {form.name && files.length > 0 && (
          <div>
            <div className='flex gap-3 justify-end mb-3'>
              <Button
                className='flex-1 lg:flex-none'
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(format));
                  alert('Minified JSON copied to clipboard!');
                }}
              >
                Copy minified json
              </Button>
              <Button
                className='flex-1 lg:flex-none'
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(format, null, 2),
                  );
                  alert('JSON copied to clipboard!');
                }}
              >
                Copy json
              </Button>
            </div>
            <pre className='bg-muted p-4 rounded-lg shadow inset-shadow-2xs text-wrap break-words'>
              {JSON.stringify(format, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </main>
  );
}
