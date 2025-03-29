import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react'
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Button disabled>
        <Loader2 className="animate-spin"></Loader2>
        Please wait
      </Button>
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button>
    </div>

  );
}
