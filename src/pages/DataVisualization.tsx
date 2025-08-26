import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  AlertTriangle, 
  MapPin, 
  BarChart3, 
  Users, 
  DollarSign,
  Heart,
  Activity
} from "lucide-react";

const DataVisualization = () => {
  const obesityByState = [
    { state: "West Virginia", rate: 38.1, severity: "critical" },
    { state: "Louisiana", rate: 36.8, severity: "critical" },
    { state: "Oklahoma", rate: 36.5, severity: "critical" },
    { state: "Mississippi", rate: 36.0, severity: "critical" },
    { state: "Alabama", rate: 35.6, severity: "critical" },
    { state: "Arkansas", rate: 35.0, severity: "high" },
    { state: "Kentucky", rate: 34.3, severity: "high" },
    { state: "Tennessee", rate: 33.7, severity: "high" },
    { state: "South Carolina", rate: 33.4, severity: "high" },
    { state: "Texas", rate: 33.0, severity: "high" }
  ];

  const healthImpacts = [
    {
      condition: "Type 2 Diabetes",
      riskIncrease: "400%",
      affectedPopulation: "37.3M Americans",
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    },
    {
      condition: "Heart Disease",
      riskIncrease: "300%", 
      affectedPopulation: "655K deaths/year",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      condition: "Stroke", 
      riskIncrease: "250%",
      affectedPopulation: "795K Americans/year",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      condition: "Sleep Apnea",
      riskIncrease: "700%",
      affectedPopulation: "22M Americans", 
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  const economicImpact = [
    {
      category: "Medical Costs",
      amount: "$173B",
      description: "Annual obesity-related healthcare costs",
      trend: "↑ 12% from 2019"
    },
    {
      category: "Individual Cost", 
      amount: "$1,861",
      description: "Extra annual medical costs per obese person",
      trend: "↑ 8% from 2019"
    },
    {
      category: "Productivity Loss",
      amount: "$6.4B", 
      description: "Lost due to obesity-related absenteeism",
      trend: "↑ 15% from 2019"
    },
    {
      category: "Medicare/Medicaid",
      amount: "$87B",
      description: "Government spending on obesity-related conditions",
      trend: "↑ 20% from 2019"
    }
  ];

  const demographics = [
    { group: "Non-Hispanic Black adults", rate: 49.9, population: "49.9%" },
    { group: "Hispanic adults", rate: 45.6, population: "45.6%" },
    { group: "Non-Hispanic White adults", rate: 41.4, population: "41.4%" },
    { group: "Non-Hispanic Asian adults", rate: 16.1, population: "16.1%" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center space-x-2 bg-warning/10 text-warning rounded-full px-4 py-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">National Health Crisis</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground">
            The Obesity Epidemic: A Data Deep Dive
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Understanding the scope and impact of obesity in America through comprehensive data analysis
          </p>
        </div>

        {/* Key Statistics */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="rounded-2xl border-2 text-center hover:shadow-bubble transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-destructive mb-2">36.2%</div>
              <div className="text-muted-foreground mb-2">US Adults Obese</div>
              <Badge variant="destructive" className="rounded-full">
                ↑ 2.4% from 2017
              </Badge>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-2 text-center hover:shadow-bubble transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-warning mb-2">73.6%</div>
              <div className="text-muted-foreground mb-2">Overweight or Obese</div>
              <Badge variant="secondary" className="rounded-full text-warning">
                ↑ Critical Level
              </Badge>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-2 text-center hover:shadow-bubble transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-accent mb-2">78M</div>
              <div className="text-muted-foreground mb-2">Adults Affected</div>
              <Badge variant="secondary" className="rounded-full text-accent">
                1 in 3 Adults
              </Badge>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-2 text-center hover:shadow-bubble transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-secondary mb-2">$173B</div>
              <div className="text-muted-foreground mb-2">Annual Cost</div>
              <Badge variant="secondary" className="rounded-full text-secondary">
                Healthcare Impact
              </Badge>
            </CardContent>
          </Card>
        </section>

        {/* Geographic Distribution */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-primary" />
            <span>Geographic Distribution</span>
          </h2>
          
          <Card className="rounded-2xl border-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>States with Highest Obesity Rates</span>
                <Badge variant="secondary" className="rounded-full">
                  2022 Data
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {obesityByState.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl border hover:shadow-soft transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-bold text-foreground">#{index + 1}</div>
                      <div>
                        <div className="font-semibold">{item.state}</div>
                        <div className="text-sm text-muted-foreground">
                          Adult obesity rate
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">
                        {item.rate}%
                      </div>
                      <Badge 
                        variant={item.severity === "critical" ? "destructive" : "secondary"}
                        className="rounded-full text-xs"
                      >
                        {item.severity === "critical" ? "Critical" : "High"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Health Impact */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center space-x-2">
            <Heart className="w-6 h-6 text-destructive" />
            <span>Health Impact & Disease Risk</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {healthImpacts.map((impact, index) => (
              <Card key={index} className="rounded-2xl border-2 hover:shadow-bubble transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl ${impact.bgColor} flex items-center justify-center`}>
                      <Activity className={`w-6 h-6 ${impact.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{impact.condition}</h3>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Risk Increase:</span>
                          <Badge variant="destructive" className="rounded-full">
                            +{impact.riskIncrease}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Affects: {impact.affectedPopulation}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Economic Impact */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-warning" />
            <span>Economic Impact</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {economicImpact.map((item, index) => (
              <Card key={index} className="rounded-2xl border-2 hover:shadow-bubble transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {item.amount}
                  </div>
                  <div className="font-semibold mb-2">{item.category}</div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {item.description}
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`rounded-full text-xs ${
                      item.trend.includes("↑") ? "text-destructive" : "text-success"
                    }`}
                  >
                    {item.trend}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Demographics */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center space-x-2">
            <Users className="w-6 h-6 text-accent" />
            <span>Demographic Disparities</span>
          </h2>
          
          <Card className="rounded-2xl border-2">
            <CardHeader>
              <CardTitle>Obesity Rates by Ethnicity (Adults 20+)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demographics.map((demo, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{demo.group}</span>
                      <span className="text-lg font-bold">{demo.rate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="h-full bg-gradient-primary rounded-full transition-all duration-1000"
                        style={{ width: `${(demo.rate / 50) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center space-y-8 py-12 bg-gradient-accent rounded-3xl">
          <div className="px-8">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Be Part of the Solution
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              These statistics represent real people and real families. Every healthy choice you make 
              contributes to changing these numbers. Your journey matters.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-accent hover:bg-white/90 rounded-2xl px-8 py-4 text-lg font-semibold shadow-float hover:shadow-glow transition-all duration-300 hover:scale-105"
              >
                <Heart className="w-5 h-5 mr-2" fill="currentColor" />
                Start Your Health Journey
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Share This Data
              </Button>
            </div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="mt-12">
          <Card className="rounded-2xl border bg-muted/30">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Data Sources & Methodology</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• CDC National Health and Nutrition Examination Survey (NHANES) 2019-2020</p>
                <p>• State of Obesity Report 2022, Trust for America's Health</p>
                <p>• Economic Impact of Obesity, Johns Hopkins Bloomberg School of Public Health</p>
                <p>• Centers for Medicare & Medicaid Services Cost Reports</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default DataVisualization;