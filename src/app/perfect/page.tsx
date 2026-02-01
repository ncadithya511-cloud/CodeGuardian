import { redirect } from 'next/navigation';

export default function PerfectPage() {
  redirect('/analyzer');
  return null;
}
