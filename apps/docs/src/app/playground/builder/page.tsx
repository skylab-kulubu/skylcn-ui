import { PageHeader } from '@skylab-kulubu/skylcn-ui';
import { PageBuilder } from '../../../demo/builder/PageBuilder';

export default function BuilderPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Sayfa kurucu"
        description="Bileşenleri bölümlere yerleştir, ayarlarını değiştir, sayfanın kodunu al."
      />
      <PageBuilder />
    </div>
  );
}
