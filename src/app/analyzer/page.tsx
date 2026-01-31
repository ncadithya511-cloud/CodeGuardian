'use client';

import { useState, type FC, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { analyzeCode, type AnalysisState } from '@/app/actions';
import { AlertTriangle, Code, Copy, FileCode2, Loader2, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const analysisInitialState: AnalysisState = { status: 'idle' };

const initialCode = `function findCommonElements(arr1, arr2) {
  const commonElements = [];
  // This nested loop is inefficient (O(n*m)) and can be optimized.
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (arr1[i] === arr2[j]) {
        // .includes() inside a loop adds more complexity.
        if (!commonElements.includes(arr1[i])) {
          commonElements.push(arr1[i]);
        }
      }
    }
  }
  return commonElements;
}`;

const exampleSnippets = [
  {
    title: 'Inefficient Loop',
    code: initialCode
  },
  {
    title: 'Complex Conditionals',
    code: `function getDiscount(user) {
  let discount = 0;
  if (user.isVip) {
    discount = 0.2;
  } else {
    if (user.purchaseHistory.length > 10) {
      if (user.accountAge > 2) {
        discount = 0.1;
      }
    } else {
      discount = 0;
    }
  }
  return discount;
}`
  },
    {
    title: 'Long Function',
    code: `function processOrder(order) {
    // Validate order
    if (!order.id || !order.items || order.items.length === 0) {
        console.error("Invalid order data");
        return;
    }

    // Connect to database
    console.log("Connecting to database...");

    // Fetch user
    const user = { id: order.userId, name: "John Doe" };
    console.log("User fetched:", user.name);

    let totalPrice = 0;
    for(const item of order.items) {
        totalPrice += item.price * item.quantity;
    }
    console.log("Total price calculated:", totalPrice);

    // Apply discount
    if (user.isVip) {
        totalPrice *= 0.9;
        console.log("VIP discount applied");
    }

    // Check inventory
    for(const item of order.items) {
        console.log("Checking stock for item:", item.name);
        // imagine stock checking logic here
    }

    // Create payment
    console.log("Processing payment...");
    
    // Send confirmation email
    console.log("Sending confirmation email...");

    // Disconnect from database
    console.log("Disconnecting from database...");

    console.log("Order processed successfully");
    return { success: true, totalPrice };
}`
  }
];

const ExampleSnippets: FC<{ onSelect: (code: string) => void }> = ({ onSelect }) => (
  <Card className="mb-8 bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Code />
        Try an Example
      </CardTitle>
      <CardDescription>
        Not sure what to analyze? Start with one of these snippets.
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-wrap gap-2">
      {exampleSnippets.map((snippet) => (
        <Button
          key={snippet.title}
          variant="outline"
          size="sm"
          onClick={() => onSelect(snippet.code)}
        >
          {snippet.title}
        </Button>
      ))}
    </CardContent>
  </Card>
);

const AnalyzeButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <ShieldCheck className="mr-2 h-4 w-4" />
          Analyze Code
        </>
      )}
    </Button>
  );
};

export default function AnalyzerPage() {
  const { toast } = useToast();
  const [code, setCode] = useState(initialCode);
  const [analysisState, analysisAction] = useActionState(analyzeCode, analysisInitialState);

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Meet Your AI <span className="text-primary">Code Guardian</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
              Leverage a hybrid static and generative AI system to analyze, score, and improve your code's quality, performance, and maintainability.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <ExampleSnippets onSelect={setCode} />
            <Card className="bg-card/70 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5">
                <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className="flex items-center gap-2">
                      <FileCode2 /> Code to Analyze
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => {
                    navigator.clipboard.writeText(code);
                    toast({ title: "Code copied to clipboard!" });
                  }}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy code</span>
                  </Button>
                </div>
                <CardDescription>
                    Paste your source code below, or use an example, to have it analyzed.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <form action={analysisAction}>
                    <Textarea
                      name="code"
                      placeholder="Enter your code here..."
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="min-h-[300px] font-code text-[13px] leading-relaxed bg-transparent"
                      required
                    />
                    <div className="mt-4">
                      <AnalyzeButton />
                    </div>
                </form>
                </CardContent>
            </Card>

            {analysisState?.status === 'error' && (
              <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Analysis Failed</AlertTitle>
                  <AlertDescription>
                      {analysisState.error || "An unknown error occurred. Please try again."}
                  </AlertDescription>
              </Alert>
            )}
          </div>
      </div>
    </main>
  );
}
