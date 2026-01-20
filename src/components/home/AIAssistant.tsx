import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
interface AIResponse {
  intent?: string;
  summary?: string;
  recommendation?: string;
  disclaimer?: string;
}
const AIAssistant = () => {
  const [userMessage, setUserMessage] = useState("");
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    if (!userMessage.trim()) {
      toast.error("Silakan masukkan pertanyaan Anda");
      return;
    }
    setIsLoading(true);
    setResponse(null);
    try {
      const res = await fetch("https://myproperty.app.n8n.cloud/webhook/mypropertyku_handler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_message: userMessage
        })
      });
      if (!res.ok) {
        throw new Error("Gagal menghubungi AI Assistant");
      }
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("AI Assistant error:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  return <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container-main">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">AI Assistant</h2>
          <p className="text-muted-foreground">
            Tanyakan apa saja tentang properti, investasi, atau kebutuhan hunian Anda. 
            AI kami siap membantu memberikan rekomendasi terbaik.
          </p>
        </div>

        {/* AI Chat Interface */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg">
            {/* Input Area */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <Textarea placeholder="Contoh: Saya mencari rumah 2 lantai di Jakarta Selatan dengan budget 2M..." value={userMessage} onChange={e => setUserMessage(e.target.value)} onKeyDown={handleKeyDown} className="min-h-[100px] resize-none bg-background border-border focus:border-primary" disabled={isLoading} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={isLoading || !userMessage.trim()} className="gap-2">
                  {isLoading ? <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sedang memproses...
                    </> : <>
                      <Send className="w-4 h-4" />
                      Kirim Pertanyaan
                    </>}
                </Button>
              </div>
            </div>

            {/* Response Area */}
            {(isLoading || response) && <div className="mt-6 pt-6 border-t border-border">
                {isLoading ? <div className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-muted-foreground text-sm">
                        AI sedang menganalisis pertanyaan Anda...
                      </p>
                    </div>
                  </div> : response && <div className="space-y-4 animate-in fade-in-50 duration-500">
                    {/* Summary */}
                    {response.summary && <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          Ringkasan
                        </h4>
                        <p className="text-foreground/90">{response.summary}</p>
                      </div>}

                    {/* Recommendation */}
                    {response.recommendation && <div className="p-4 rounded-xl bg-accent/50 border border-accent">
                        <h4 className="font-semibold text-foreground mb-2">
                          💡 Rekomendasi
                        </h4>
                        <p className="text-foreground/90">{response.recommendation}</p>
                      </div>}

                    {/* Disclaimer */}
                    {response.disclaimer && <p className="text-xs text-muted-foreground italic px-2">
                        ⚠️ {response.disclaimer}
                      </p>}
                  </div>}
              </div>}
          </div>
        </div>
      </div>
    </section>;
};
export default AIAssistant;