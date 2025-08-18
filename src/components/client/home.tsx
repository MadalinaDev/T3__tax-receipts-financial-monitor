"use client";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import {
  Upload,
  Brain,
  Tags,
  ChartColumn,
  Camera,
  QrCode,
  Link,
  Zap,
  CheckCircle,
  List,
  BarChart2,
  TrendingUp,
  DollarSign,
} from "lucide-react";

const Home = () => {
  const router = useRouter();
  const features = [
    {
      id: "0",
      title: "Upload Any Way You Want",
      description: (
        <div>
          Snap photos, scan QR codes, paste URLs, or manually input receipt
          data. For now, supporting official receipts only in{" "}
          <span className="font-medium underline">Republic of Moldova</span>.
        </div>
      ),
      icon: Upload,
    },
    {
      id: "1",
      title: "Smart Financial Insights",
      description:
        "Our AI analyzes your spending patterns, identifies trends, and provides actionable insights to optimize your finances.",
      icon: Brain,
    },
    {
      id: "2",
      title: "Automatic Organization",
      description:
        "Get detailed statistics and insights on your spending patterns. Our AI identifies trends and helps you understand your finances better.",
      icon: Tags,
    },
    {
      id: "3",
      title: "Interactive Dashboards",
      description:
        "Beautiful charts and graphs show where your money goes, when you spend most, and how your habits change over time.",
      icon: ChartColumn,
    },
  ];

  const steps = [
    {
      id: "0",
      title: "1. Capture & Upload",
      description: (
        <div>
          Take a photo of your receipt, scan a QR code, paste a digital receipt
          URL, or manually enter the details. Our system accepts all formats,
          for now, supporting official receipts only in{" "}
          <span className="font-medium underline">Republic of Moldova</span>.
        </div>
      ),
      benefits: [
        { name: "Photo", icon: Camera },
        { name: "QR Code", icon: QrCode },
        { name: "URL", icon: Link },
      ],
      icon: Zap,
    },
    {
      id: "1",
      title: "2. AI Does the Work",
      description:
        "Our advanced AI extracts all relevant information, categorizes expenses, identifies merchants, and analyzes spending patterns. Everything happens automatically in seconds.",
      benefits: [
        { name: "Instant", icon: Zap },
        { name: "Accurate", icon: CheckCircle },
        { name: "Categorized", icon: List },
      ],
      icon: Zap,
    },
    {
      id: "2",
      title: "3. Discover Your Financial Story",
      description:
        "View comprehensive analytics showing what you buy most, where you shop, seasonal spending patterns, and personalized recommendations.",
      benefits: [
        { name: "Analytics", icon: BarChart2 },
        { name: "Trends", icon: TrendingUp },
        { name: "Tax Ready", icon: DollarSign },
      ],
      icon: BarChart2,
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="my-30">
        <div className="flex flex-col gap-12 md:flex-row">
          <div className="flex-1">
            <Badge
              variant="outline"
              className="border-yellow text-yellow mx-1 mb-2"
            >
              AI-Powered Financial Intelligence
            </Badge>
            <h1 className="text-4xl leading-12 font-semibold md:leading-20 lg:text-7xl">
              <span>Turn Every</span> <br />{" "}
              <span className="">Receipt Into</span> <br />
              <span className="">Financial Clarity</span> <br />
            </h1>
            <Button
              variant="outline"
              className="group before:bg-navy-blue relative z-10 mx-3 mt-6 ml-auto block px-6 before:absolute before:top-0 before:left-0 before:-z-10 before:h-full before:w-0 before:overflow-hidden before:rounded-lg before:duration-700 hover:text-white hover:before:w-full"
              onClick={() => router.push("/upload")}
            >
              {" "}
              <div className="flex place-items-center px-6">
                Get Started
                <ChevronRight className="-mr-4 ml-1 hidden inline text-white group-hover:inline" />
              </div>
            </Button>
          </div>
          <div className="h-full w-full flex-1 overflow-hidden rounded-md shadow-md">
            <video
              width="320"
              height="240"
              preload="auto"
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            >
              <source src="/hero-animation.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="my-48">
        <h2 className="my-2 text-center text-2xl font-semibold lg:text-4xl">
          Powerful Features for Complete Financial Control
        </h2>
        <h3 className="text-muted-navy-blue text-center text-lg lg:text-2xl">
          Everything you need to transform scattered receipts into actionable
          financial insights
        </h3>
        <div className="my-12 grid grid-cols-1 gap-6 md:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.id}
                className="group w-full duration-300 hover:scale-95"
              >
                <CardContent className="text-navy-blue space-y-2 text-center">
                  <Icon className="text-navy-blue/90 group-hover:text-yellow mx-auto size-12 md:size-16" />
                  <h3 className="text-md font-bold">{feature.title}</h3>
                  <h5 className="text-muted-navy-blue text-sm">
                    {feature.description}
                  </h5>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Steps Section */}
      <section className="-mx-8 mb-24 bg-white py-6 shadow-[0_-7px_6px_#00000013,0_7px_6px_#00000013] md:-mx-36 md:py-12">
        <h2 className="my-2 text-center text-2xl font-semibold lg:text-4xl">
          Get Financial Clarity in 3 Simple Steps
        </h2>
        <h3 className="text-muted-navy-blue text-center text-lg lg:text-2xl">
          From receipt to insight in seconds - here&lsquo;s how ReceiptIQ
          transforms your financial data
        </h3>
        <div className="mx-auto mt-12 flex flex-col gap-6 px-8 md:flex-row md:px-36">
          {steps.map((step) => {
            return (
              <Card
                key={step.id}
                className="flex-1 duration-300 hover:scale-95"
              >
                <CardContent className="text-navy-blue space-y-2 text-center">
                  <h3 className="text-md font-bold">{step.title}</h3>
                  <h5 className="text-muted-navy-blue text-sm">
                    {step.description}
                  </h5>
                  <div className="mt-6 flex flex-row justify-center gap-2">
                    {step.benefits?.map((benefit) => {
                      const Icon = benefit.icon;
                      return (
                        <Badge
                          key={benefit.name}
                          variant="outline"
                          className="text-muted-navy-blue"
                        >
                          {" "}
                          <Icon /> {benefit.name}
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="my-24">
        <h2 className="my-2 text-center text-2xl font-semibold lg:text-4xl">
          Ready to Master Your Finances?{" "}
        </h2>
        <h3 className="text-muted-navy-blue px-12 text-center text-lg whitespace-pre-line md:px-36 lg:text-2xl">
          {
            "Explore AI-powered receipt analysis and get clear insights into your spending, currently supporting official receipts in Moldova."
          }
        </h3>
        <Button
          variant="outline"
          className="group before:bg-navy-blue relative z-10 mx-3 mx-auto mt-6 block px-6 before:absolute before:top-0 before:left-0 before:-z-10 before:h-full before:w-0 before:overflow-hidden before:rounded-lg before:duration-700 hover:text-white hover:before:w-full"
          onClick={() => router.push("/upload")}
        >
          {" "}
          <div className="flex place-items-center px-6">
            Get Started
            <ChevronRight className="-mr-4 ml-1 hidden inline text-white group-hover:inline" />
          </div>
        </Button>
      </section>
    </main>
  );
};

export default Home;
