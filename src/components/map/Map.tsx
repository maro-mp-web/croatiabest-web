import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const DynamicMap = dynamic(() => import('./DynamicMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-secondary/10">
      <Loader2 className="size-12 animate-spin text-primary opacity-20" />
    </div>
  ),
});

export default function Map(props: any) {
  return <DynamicMap {...props} />;
}
