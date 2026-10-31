'use client';

import { Button, TaskPage } from '@skylab-kulubu/skylcn-ui';
import { LogIn } from 'lucide-react';

/** A sign-in page: the club's mark, one line on what the account opens, one button. */
export default function SignInPage() {
  return (
    <TaskPage
      align="center"
      title="Giriş yap"
      description="Kulüp hesabınla gir; etkinliklerin, sertifikaların ve formların burada."
      actions={
        <Button variant="primary" className="sm:flex-1" render={<a href="/api/auth/login" />}>
          <LogIn aria-hidden />
          SKY LAB ile giriş yap
        </Button>
      }
      footer={
        <>
          <a href="/gizlilik">Gizlilik</a>
          <a href="/yardim">Yardım</a>
        </>
      }
    />
  );
}
