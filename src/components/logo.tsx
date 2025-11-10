import { Bot } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Bot className="h-8 w-8 text-primary" />
      <span className="font-headline text-xl font-bold text-foreground hidden sm:inline-block">
        Personalized Learning Nexus
      </span>
    </div>
  );
}
