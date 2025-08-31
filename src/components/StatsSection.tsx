import { TrendingUp, Users, Building, Award } from "lucide-react";

export const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: "2.5M+",
      label: "Trusted Customers",
      description: "Banking with confidence"
    },
    {
      icon: Building,
      value: "$145B",
      label: "Assets Under Management",
      description: "Growing your wealth"
    },
    {
      icon: TrendingUp,
      value: "4.8%",
      label: "Average Savings APY",
      description: "Competitive returns"
    },
    {
      icon: Award,
      value: "135+",
      label: "Years of Excellence",
      description: "Banking heritage since 1885"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Banking Excellence by the Numbers
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our commitment to financial excellence is reflected in our growth, 
            customer satisfaction, and the trust placed in us by millions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center banking-card p-8 hover-lift animate-scale-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="hero-text text-4xl md:text-5xl font-bold mb-2">
                {stat.value}
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                {stat.label}
              </h3>
              <p className="text-muted-foreground">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};