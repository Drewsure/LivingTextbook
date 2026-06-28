import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Gamepad2, Check, Zap, School, Building2 } from "lucide-react";
import { SocialLinks } from "@/components/SocialLinks";

const plans = [
  {
    name: "Free",
    icon: Gamepad2,
    price: "$0",
    period: "forever",
    description: "Perfect for trying out Ministar Game Studio",
    features: [
      "3 worksheets per month",
      "5 game types",
      "Basic analytics",
      "Share via game code",
      "Student leaderboards",
    ],
    cta: "Get Started",
    ctaLink: "/auth",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    icon: Zap,
    price: "$12",
    period: "/month",
    description: "For teachers who want the full experience",
    features: [
      "Unlimited worksheets",
      "All 20+ game types",
      "Advanced analytics & reports",
      "Printable worksheets",
      "Priority AI generation",
      "Custom branding",
      "Bulk game creation",
    ],
    cta: "Start Free Trial",
    ctaLink: "/auth",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Custom",
    period: "",
    description: "For schools & districts with advanced needs",
    features: [
      "Everything in Pro",
      "Unlimited teacher accounts",
      "School-wide analytics dashboard",
      "SSO & admin controls",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    ctaLink: "/auth",
    variant: "outline" as const,
    popular: false,
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <Gamepad2 className="h-8 w-8 text-primary" />
          <span className="font-display text-2xl font-bold text-foreground">
            Ministar<span className="text-primary"> Game Studio</span>
          </span>
        </Link>
        <div className="flex gap-3">
          <Button variant="ghost" asChild>
            <Link to="/blog">Blog</Link>
          </Button>
          <Button asChild>
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Header */}
      <section className="px-6 pt-16 pb-8 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
            <School className="h-4 w-4" />
            Simple, transparent pricing
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-4">
            Plans for every <span className="text-primary">classroom</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade when you're ready. No hidden fees, cancel anytime.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className={plan.popular ? "md:-mt-4" : ""}
            >
              <Card
                className={`relative overflow-hidden ${
                  plan.popular
                    ? "border-2 border-primary shadow-xl ring-2 ring-primary/20"
                    : "border border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-none rounded-bl-lg px-3 py-1 text-xs">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl ${plan.popular ? "bg-primary/10" : "bg-muted"}`}>
                      <plan.icon className={`h-6 w-6 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <CardTitle className="font-display text-xl">{plan.name}</CardTitle>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground text-sm">{plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={plan.variant}
                    size="lg"
                    className="w-full rounded-xl"
                    asChild
                  >
                    <Link to={plan.ctaLink}>{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ-like section */}
      <section className="px-6 py-16 bg-card/50">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6 text-left">
            {[
              { q: "Can I try Pro features for free?", a: "Yes! Every new account gets a 14-day free trial of Pro with no credit card required." },
              { q: "What happens when my trial ends?", a: "You'll be moved to the Free plan automatically. No charges, no surprises." },
              { q: "Can I switch plans anytime?", a: "Absolutely. Upgrade, downgrade, or cancel at any time from your dashboard." },
              { q: "Do students need accounts?", a: "Nope! Students just enter a game code — no signups, no emails, no friction." },
            ].map((faq) => (
              <div key={faq.q} className="p-5 rounded-2xl bg-background border border-border">
                <h3 className="font-display font-bold text-foreground mb-1">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 text-center">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Gamepad2 className="h-5 w-5" />
            <span className="font-display font-semibold">Ministar Game Studio</span>
          </div>
          <SocialLinks className="justify-center" />
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
