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

export default function Home() {
  const maxSize = 100 * 1024 * 1024 * 100000000;
  const maxFiles = 1000000000;
  const [form, setForm] = useState({
    name: '',
    directory: 'src/components/ui',
    dependencies: [] as string[],
    registryDependencies: [] as string[],
  });
  const [format, setFormat] = useState<any>(null);

  const [fileContents, setFileContents] = useState<any[]>([]);

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
    accept: '.tsx,.jsx,.ts,.js',
  });

  useEffect(() => {
    setFileContents((prev) =>
      prev.filter((f) => files.some((fw) => fw.file.name === f.path))
    );

    files.forEach((fileWrapper) => {
      if (fileWrapper.file instanceof File) {
        const reader = new FileReader();
        reader.onload = () => {
          setFileContents((prev) => {
            const filtered = prev.filter(
              (f) => f.path !== fileWrapper.file.name
            );
            return [
              ...filtered,
              {
                type: 'registry:file',
                path: fileWrapper.file.name,
                target: '',
                content: reader.result,
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
      files: fileContents.map((item) => ({
        ...item,
        path: `${form.directory}/${item.path}`,
        target: `${form.directory}/${item.path}`,
      })),
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
            <Label htmlFor='directory'>Directory</Label>
            <Input
              id='directory'
              placeholder='Directory'
              value={form.directory}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, directory: e.target.value }))
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
          <div className='grid w-full items-center gap-3 lg:col-span-3'>
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
        {form.name && form.directory && files.length > 0 && (
          <div>
            <div className='flex gap-3 justify-end mb-3'>
              <Button
                className='flex-1 lg:flex-none'
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(format))
                }
              >
                Copy minified json
              </Button>
              <Button
                className='flex-1 lg:flex-none'
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(format, null, 2))
                }
              >
                Copy json
              </Button>
            </div>
            <pre className='bg-muted p-4 rounded-lg whitespace-pre-wrap'>
              {JSON.stringify(format, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </main>
  );
}
