import { Navigation } from "@/components/Navigation";
import { useMemeSubmissions, useSubmitMeme } from "@/hooks/use-meme-contest";
import { useWallet } from "@/hooks/use-wallet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Heart, Trophy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function MemeContest() {
  const { data: memes, isLoading } = useMemeSubmissions();
  const { isConnected, userId } = useWallet();
  const submitMutation = useSubmitMeme();
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    submitMutation.mutate({
      userId,
      imageUrl,
      caption
    }, {
      onSuccess: () => {
        setOpen(false);
        setImageUrl("");
        setCaption("");
      }
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-pink-900/10 via-background to-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 rounded-full mb-6">
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          <h1 className="text-5xl font-display font-bold mb-4">Meme Contest</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Submit your dankest Slerf memes. Top voted submissions win exclusive airdrops.
          </p>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" disabled={!isConnected} className="text-lg h-12 px-8 shadow-lg shadow-primary/20">
                <Upload className="w-4 h-4 mr-2" /> Submit Meme
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-white/10">
              <DialogHeader>
                <DialogTitle>Upload Meme</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input 
                    placeholder="https://..." 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="bg-secondary/50 border-white/10"
                    required 
                  />
                  <p className="text-xs text-muted-foreground">Paste a direct link to your image</p>
                </div>
                <div className="space-y-2">
                  <Label>Caption</Label>
                  <Input 
                    placeholder="When you slerf too hard..." 
                    value={caption} 
                    onChange={(e) => setCaption(e.target.value)}
                    className="bg-secondary/50 border-white/10"
                    required 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitMutation.isPending}>
                  {submitMutation.isPending ? "Uploading..." : "Submit Entry"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-20">Loading dankness...</div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {memes?.map((meme) => (
              <div key={meme.id} className="break-inside-avoid">
                <Card className="glass-card overflow-hidden group hover:border-primary/30 transition-all">
                  <div className="relative aspect-auto">
                    {/* Use Unsplash placeholder if URL fails or is empty for demo */}
                    <img 
                      src={meme.imageUrl || `https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3`} 
                      alt={meme.caption || "Meme"}
                      className="w-full h-auto object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=60";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <Button size="sm" className="self-end bg-red-500 hover:bg-red-600 text-white gap-2">
                        <Heart className="w-4 h-4 fill-current" /> {meme.votes}
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-lg leading-tight">{meme.caption}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
