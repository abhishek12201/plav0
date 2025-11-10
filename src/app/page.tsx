import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, BookOpenText, Target, BarChart } from "lucide-react";
import { Logo } from "@/components/logo";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const features = [
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: "AI-Powered Quiz Generator",
    description: "Generate personalized quizzes from your learning content to test your knowledge and retention.",
  },
  {
    icon: <BookOpenText className="h-10 w-10 text-primary" />,
    title: "Personalized Study Plans",
    description: "Receive AI-driven study plans that adapt to your progress and target your knowledge gaps.",
  },
  {
    icon: <Target className="h-10 w-10 text-primary" />,
    title: "Adaptive Feedback",
    description: "Get customized feedback on your quiz performance to understand your mistakes and learn effectively.",
  },
  {
    icon: <BarChart className="h-10 w-10 text-primary" />,
    title: "Performance Metrics",
    description: "Visualize your learning journey with an intuitive dashboard tracking your progress and skills.",
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-landing");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40 z-10 bg-background/50 backdrop-blur-sm sticky top-0">
        <Link href="/" className="flex items-center justify-center">
          <Logo />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href="/login">
              Log in
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="relative w-full pt-12 md:pt-24 lg:pt-32">
          {heroImage && (
             <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover -z-10 opacity-10"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="container px-4 md:px-6 space-y-10 xl:space-y-16">
            <div className="max-w-[800px] mx-auto text-center">
              <h1 className="lg:leading-tighter text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl xl:text-7xl font-headline">
                The Future of Learning, {" "}
                <span className="text-primary">Personalized for You</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl my-6">
                Leverage the power of AI to create a learning experience tailored to your unique needs. Generate quizzes, get adaptive feedback, and follow a personalized study plan to master any subject.
              </p>
              <div className="space-x-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/dashboard">
                    Start Your Journey
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Unlock Your Full Potential</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is packed with cutting-edge tools designed to make learning more efficient, engaging, and effective.
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-2">
              {features.map((feature, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Personalized Learning Nexus. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
