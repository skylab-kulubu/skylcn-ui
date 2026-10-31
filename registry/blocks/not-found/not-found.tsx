import { Button, StatusPage } from '@skylab-kulubu/skylcn-ui';

/** The page for an address that leads nowhere; Next.js shows it from app/not-found.tsx. */
export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="Bu sayfa yok"
      description="Bağlantı eskimiş ya da yanlış yazılmış olabilir."
    >
      <Button variant="primary" render={<a href="/" />}>
        Ana sayfaya dön
      </Button>
    </StatusPage>
  );
}
