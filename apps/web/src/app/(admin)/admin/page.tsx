import { redirect } from 'next/navigation';

export default function AdminRootPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  redirect('/admin/dashboard' as any);
}
