import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function EmailCaptureContextual() {
  const [email, setEmail] = useState("");
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Get product update alerts</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <label className="flex items-center gap-2 text-sm"><Checkbox /> Trust score alerts</label>
        <label className="flex items-center gap-2 text-sm"><Checkbox /> Template alerts</label>
        <label className="flex items-center gap-2 text-sm"><Checkbox /> Monthly best-of digest</label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" aria-label="Email" />
        <Button disabled={!email}>Subscribe</Button>
      </CardContent>
    </Card>
  );
}
