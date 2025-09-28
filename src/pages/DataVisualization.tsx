import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertTriangle, MapPin, BarChart3, Users, DollarSign, Heart, Activity, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
const DataVisualization = () => {
  const navigate = useNavigate();
  // Updated with accurate CDC 2023 data
  const obesityByState = [
    { state: "West Virginia", rate: 41.0, severity: "critical", region: "South" },
    { state: "Arkansas", rate: 40.0, severity: "critical", region: "South" },
    { state: "Alabama", rate: 39.2, severity: "critical", region: "South" },
    { state: "Louisiana", rate: 38.0, severity: "critical", region: "South" },
    { state: "Mississippi", rate: 37.1, severity: "critical", region: "South" },
    { state: "Oklahoma", rate: 36.8, severity: "critical", region: "South" },
    { state: "Tennessee", rate: 36.5, severity: "critical", region: "South" },
    { state: "Kentucky", rate: 36.0, severity: "critical", region: "South" },
    { state: "Delaware", rate: 35.7, severity: "critical", region: "Northeast" },
    { state: "Alaska", rate: 35.2, severity: "critical", region: "West" },
    { state: "Ohio", rate: 35.0, severity: "critical", region: "Midwest" },
    { state: "Indiana", rate: 34.8, severity: "high", region: "Midwest" },
    { state: "Iowa", rate: 34.4, severity: "high", region: "Midwest" },
    { state: "North Carolina", rate: 34.2, severity: "high", region: "South" },
    { state: "Kansas", rate: 34.0, severity: "high", region: "Midwest" },
    { state: "Georgia", rate: 33.8, severity: "high", region: "South" },
    { state: "South Carolina", rate: 33.6, severity: "high", region: "South" },
    { state: "Missouri", rate: 33.4, severity: "high", region: "Midwest" },
    { state: "Texas", rate: 33.0, severity: "high", region: "South" },
    { state: "Florida", rate: 30.1, severity: "moderate", region: "South" },
    { state: "Arizona", rate: 31.9, severity: "moderate", region: "West" },
    { state: "Connecticut", rate: 29.4, severity: "moderate", region: "Northeast" },
    { state: "California", rate: 27.7, severity: "moderate", region: "West" },
    { state: "Colorado", rate: 24.9, severity: "low", region: "West" },
    { state: "District of Columbia", rate: 23.5, severity: "low", region: "Northeast" }
  ];

  const topStates = obesityByState.slice(0, 10);
  const lowestStates = obesityByState.slice(-5).reverse();

  const regionalData = [
    { region: "South", rate: 35.8, color: "hsl(var(--destructive))" },
    { region: "Midwest", rate: 33.9, color: "hsl(var(--warning))" },
    { region: "West", rate: 28.4, color: "hsl(var(--secondary))" },
    { region: "Northeast", rate: 28.1, color: "hsl(var(--primary))" }
  ];

  const severityData = [
    { severity: "Critical (40%+)", count: 3, color: "hsl(var(--destructive))" },
    { severity: "Very High (35-39%)", count: 20, color: "hsl(var(--warning))" },
    { severity: "High (30-34%)", count: 17, color: "hsl(var(--secondary))" },
    { severity: "Moderate (25-29%)", count: 7, color: "hsl(var(--primary))" },
    { severity: "Lower (<25%)", count: 3, color: "hsl(var(--accent))" }
  ];

  const chartConfig = {
    rate: {
      label: "Obesity Rate (%)",
      color: "hsl(var(--primary))",
    },
    critical: {
      label: "Critical (40%+)",
      color: "hsl(var(--destructive))",
    },
    high: {
      label: "High (35-39%)",
      color: "hsl(var(--warning))",
    },
    moderate: {
      label: "Moderate (30-34%)",
      color: "hsl(var(--secondary))",
    },
    low: {
      label: "Lower (<30%)",
      color: "hsl(var(--primary))",
    },
  };
  const healthImpacts = [{
    condition: "Type 2 Diabetes",
    riskIncrease: "400%",
    affectedPopulation: "37.3M Americans",
    color: "text-destructive",
    bgColor: "bg-destructive/10"
  }, {
    condition: "Heart Disease",
    riskIncrease: "300%",
    affectedPopulation: "655K deaths/year",
    color: "text-warning",
    bgColor: "bg-warning/10"
  }, {
    condition: "Stroke",
    riskIncrease: "250%",
    affectedPopulation: "795K Americans/year",
    color: "text-secondary",
    bgColor: "bg-secondary/10"
  }, {
    condition: "Sleep Apnea",
    riskIncrease: "700%",
    affectedPopulation: "22M Americans",
    color: "text-accent",
    bgColor: "bg-accent/10"
  }];
  const economicImpact = [{
    category: "Medical Costs",
    amount: "$173B",
    description: "Annual obesity-related healthcare costs",
    trend: "↑ 12% from 2019"
  }, {
    category: "Individual Cost",
    amount: "$1,861",
    description: "Extra annual medical costs per obese person",
    trend: "↑ 8% from 2019"
  }, {
    category: "Productivity Loss",
    amount: "$6.4B",
    description: "Lost due to obesity-related absenteeism",
    trend: "↑ 15% from 2019"
  }, {
    category: "Medicare/Medicaid",
    amount: "$87B",
    description: "Government spending on obesity-related conditions",
    trend: "↑ 20% from 2019"
  }];
  const demographics = [{
    group: "Non-Hispanic Black adults",
    rate: 49.9,
    population: "49.9%"
  }, {
    group: "Hispanic adults",
    rate: 45.6,
    population: "45.6%"
  }, {
    group: "Non-Hispanic White adults",
    rate: 41.4,
    population: "41.4%"
  }, {
    group: "Non-Hispanic Asian adults",
    rate: 16.1,
    population: "16.1%"
  }];
  return <div className="min-h-screen bg-background">
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top States Chart */}
            <Card className="rounded-2xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Highest Obesity Rates by State</span>
                  <Badge variant="destructive" className="rounded-full">
                    CDC 2023
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topStates} layout="horizontal" margin={{ left: 60, right: 20 }}>
                      <XAxis type="number" domain={[0, 45]} />
                      <YAxis type="category" dataKey="state" width={60} fontSize={12} />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [`${value}%`, "Obesity Rate"]}
                      />
                      <Bar 
                        dataKey="rate" 
                        fill="hsl(var(--destructive))" 
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Regional Breakdown */}
            <Card className="rounded-2xl border-2">
              <CardHeader>
                <CardTitle>Obesity Rates by Region</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionalData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="rate"
                        label={({ region, rate }) => `${region}: ${rate}%`}
                      >
                        {regionalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [`${value}%`, "Average Rate"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  The South shows the highest regional obesity rates
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed State Rankings */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="rounded-2xl border-2">
              <CardHeader>
                <CardTitle className="text-destructive">States with Crisis-Level Rates (40%+)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {obesityByState.filter(state => state.rate >= 40).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{item.state}</div>
                          <div className="text-sm text-muted-foreground">{item.region} Region</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-destructive">{item.rate}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2">
              <CardHeader>
                <CardTitle className="text-primary">Lowest Obesity Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowestStates.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{item.state}</div>
                          <div className="text-sm text-muted-foreground">{item.region} Region</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{item.rate}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Insights */}
          <Card className="mt-8 rounded-2xl border-2 bg-gradient-to-br from-background to-muted/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span>Key Geographic Insights</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <div className="font-semibold text-destructive mb-2">Southern States Dominance</div>
                  <div className="text-muted-foreground">
                    8 of the top 10 states with highest obesity rates are in the South, with West Virginia leading at 41%
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                  <div className="font-semibold text-secondary mb-2">Rural vs Urban Divide</div>
                  <div className="text-muted-foreground">
                    States with higher rural populations consistently show elevated obesity rates
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="font-semibold text-primary mb-2">West Coast Success</div>
                  <div className="text-muted-foreground">
                    Colorado, California, and DC maintain the lowest rates, all under 28%
                  </div>
                </div>
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
            {healthImpacts.map((impact, index) => <Card key={index} className="rounded-2xl border-2 hover:shadow-bubble transition-all duration-300">
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
              </Card>)}
          </div>
        </section>

        {/* Economic Impact */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-warning" />
            <span>Economic Impact</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {economicImpact.map((item, index) => <Card key={index} className="rounded-2xl border-2 hover:shadow-bubble transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {item.amount}
                  </div>
                  <div className="font-semibold mb-2">{item.category}</div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {item.description}
                  </div>
                  <Badge variant="secondary" className={`rounded-full text-xs ${item.trend.includes("↑") ? "text-destructive" : "text-success"}`}>
                    {item.trend}
                  </Badge>
                </CardContent>
              </Card>)}
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
                {demographics.map((demo, index) => <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{demo.group}</span>
                      <span className="text-lg font-bold">{demo.rate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="h-full bg-gradient-primary rounded-full transition-all duration-1000" style={{
                    width: `${demo.rate / 50 * 100}%`
                  }} />
                    </div>
                  </div>)}
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
                onClick={() => navigate('/dashboard')}
                className="bg-white text-accent hover:bg-white/90 rounded-2xl px-8 py-4 text-lg font-semibold shadow-float hover:shadow-glow transition-all duration-300 hover:scale-105"
              >
                <Heart className="w-5 h-5 mr-2" fill="currentColor" />
                Start Your Health Journey
              </Button>
              
              
            </div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="mt-12">
          <Card className="rounded-2xl border bg-muted/30">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center space-x-2">
                <ExternalLink className="w-5 h-5 text-primary" />
                <span>Data Sources & References</span>
              </h3>
              <div className="text-sm space-y-3">
                <div className="p-3 rounded-lg bg-background border">
                  <div className="font-medium text-foreground mb-1">Centers for Disease Control and Prevention (CDC)</div>
                  <div className="text-muted-foreground mb-2">Adult Obesity Prevalence Maps - 2023 Behavioral Risk Factor Surveillance System (BRFSS)</div>
                  <a href="https://www.cdc.gov/obesity/data-and-statistics/adult-obesity-prevalence-maps.html" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="text-primary hover:text-primary/80 text-xs flex items-center space-x-1">
                    <span>cdc.gov/obesity/data-and-statistics/adult-obesity-prevalence-maps.html</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                
                <div className="p-3 rounded-lg bg-background border">
                  <div className="font-medium text-foreground mb-1">Trust for America's Health (TFAH)</div>
                  <div className="text-muted-foreground mb-2">State of Obesity 2024: Better Policies for a Healthier America</div>
                  <a href="https://www.tfah.org/report-details/state-of-obesity-2024/" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="text-primary hover:text-primary/80 text-xs flex items-center space-x-1">
                    <span>tfah.org/report-details/state-of-obesity-2024/</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-3 rounded-lg bg-background border">
                  <div className="font-medium text-foreground mb-1">Visual Capitalist</div>
                  <div className="text-muted-foreground mb-2">Mapped: U.S. Obesity Rates by State - 2024 Analysis</div>
                  <a href="https://www.visualcapitalist.com/mapped-u-s-obesity-rates-by-state/" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="text-primary hover:text-primary/80 text-xs flex items-center space-x-1">
                    <span>visualcapitalist.com/mapped-u-s-obesity-rates-by-state/</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-3 rounded-lg bg-background border">
                  <div className="font-medium text-foreground mb-1">USAFacts</div>
                  <div className="text-muted-foreground mb-2">Obesity Rate Nearly Triples in United States Over Last 50 Years</div>
                  <a href="https://usafacts.org/articles/obesity-rate-nearly-triples-united-states-over-last-50-years/" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="text-primary hover:text-primary/80 text-xs flex items-center space-x-1">
                    <span>usafacts.org/articles/obesity-rate-nearly-triples-united-states-over-last-50-years/</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-3 rounded-lg bg-background border">
                  <div className="font-medium text-foreground mb-1">U.S. News & World Report</div>
                  <div className="text-muted-foreground mb-2">The 10 Most Obese States in America - 2025 Analysis</div>
                  <a href="https://www.usnews.com/news/best-states/slideshows/the-most-obese-states-in-america" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="text-primary hover:text-primary/80 text-xs flex items-center space-x-1">
                    <span>usnews.com/news/best-states/slideshows/the-most-obese-states-in-america</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-muted/50 border-l-4 border-primary">
                  <div className="font-medium text-foreground mb-1">Methodology Note</div>
                  <div className="text-muted-foreground text-xs leading-relaxed">
                    All obesity prevalence data is based on self-reported height and weight from the CDC's Behavioral Risk Factor Surveillance System (BRFSS). 
                    Rates are age-adjusted and represent adults aged 18 and older. Regional averages are population-weighted. 
                    Data reflects the most recent available statistics as of September 2024.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>;
};
export default DataVisualization;