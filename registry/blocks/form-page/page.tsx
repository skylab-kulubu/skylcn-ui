'use client';

import {
  Button,
  ChoiceList,
  Field,
  FileUpload,
  Textarea,
  type FileUploadItem,
} from '@skylab-kulubu/skylcn-ui';
import { useState } from 'react';

const TRACKS = [
  { value: 'web', label: 'Web geliştirme', description: 'React, Next.js, API tasarımı' },
  { value: 'game', label: 'Oyun geliştirme', description: 'Unity, Godot' },
  { value: 'ai', label: 'Yapay zekâ', description: 'Model eğitimi, veri hazırlama' },
];

/** A form people fill in: numbered questions, choice cards, a file and one send button. */
export default function ApplicationForm() {
  const [track, setTrack] = useState<string | null>(null);
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  return (
    <form className="flex max-w-xl flex-col gap-8" onSubmit={(event) => event.preventDefault()}>
      <Field variant="question" number={1} label="Hangi alanda çalışmak istersin?">
        <ChoiceList aria-label="Alan" options={TRACKS} value={track} onValueChange={setTrack} />
      </Field>
      <Field
        variant="question"
        number={2}
        label="Neden katılmak istiyorsun?"
        description="Birkaç cümle yeter."
      >
        <Textarea rows={4} />
      </Field>
      <Field variant="question" number={3} label="Özgeçmişin" description="İsteğe bağlı.">
        <FileUpload
          files={files}
          accept=".pdf"
          rules="PDF, en çok 5 MB"
          onFiles={(added) =>
            setFiles((current) => [
              ...current,
              ...added.map((file) => ({
                id: `${file.name}-${file.size}`,
                name: file.name,
                size: file.size,
                status: 'ready' as const,
              })),
            ])
          }
          onRemove={(id) => setFiles((current) => current.filter((file) => file.id !== id))}
        />
      </Field>
      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Başvuruyu gönder
        </Button>
      </div>
    </form>
  );
}
