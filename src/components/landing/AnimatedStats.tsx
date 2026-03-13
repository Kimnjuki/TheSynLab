import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { Users, Globe, Clock, Shield } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 10000,
    suffix: "+",
    label: "Active Users",
    color: "text-primary",
  },
  {
    icon: Shield,
    value: 99.9,
    suffix: "%",
    decimals: 1,
    label: "Uptime Guarantee",
    color: "text-secondary",
  },
  {
    icon: Globe,
    value: 50,
    suffix: "+",
    label: "Countries",
    color: "text-accent",
  },
  {
    icon: Clock,
    value: 24,
    suffix: "/7",
    label: "Support Available",
    color: "text-success",
  },
];

const AnimatedStats = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section ref={ref} className="py-16 bg-muted/30">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`mb-4 p-3 rounded-xl bg-muted ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {inView ? (
                    <CountUp
                      end={stat.value}
                      decimals={stat.decimals || 0}
                      duration={2.5}
                      suffix={stat.suffix}
                    />
                  ) : (
                    `0${stat.suffix}`
                  )}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AnimatedStats;
