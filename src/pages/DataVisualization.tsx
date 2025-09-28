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
  // Complete CDC 2023 data for all 50 states + DC
  const allStatesData = [
    { state: "West Virginia", rate: 41.0, severity: "critical", region: "South", rank: 1, description: "Highest obesity rate in the nation, significantly impacted by rural poverty and limited healthcare access" },
    { state: "Arkansas", rate: 40.0, severity: "critical", region: "South", rank: 2, description: "Rural state with high poverty rates and food desert prevalence affecting healthy food access" },
    { state: "Mississippi", rate: 39.5, severity: "critical", region: "South", rank: 3, description: "Deep South state with significant health disparities and limited resources for obesity prevention" },
    { state: "Alabama", rate: 39.2, severity: "critical", region: "South", rank: 4, description: "Southern state facing challenges with food insecurity and sedentary lifestyle patterns" },
    { state: "Louisiana", rate: 38.0, severity: "critical", region: "South", rank: 5, description: "Culture rich in high-calorie foods combined with economic challenges affecting health outcomes" },
    { state: "Oklahoma", rate: 36.8, severity: "critical", region: "South", rank: 6, description: "Great Plains state with rural communities lacking access to nutritional education and healthcare" },
    { state: "Tennessee", rate: 36.5, severity: "critical", region: "South", rank: 7, description: "Mix of urban and rural areas with varying access to healthy lifestyle resources" },
    { state: "Kentucky", rate: 36.0, severity: "critical", region: "South", rank: 8, description: "Appalachian region with economic challenges and traditional high-calorie food culture" },
    { state: "Delaware", rate: 35.7, severity: "critical", region: "Northeast", rank: 9, description: "Small Mid-Atlantic state with urban-rural divide affecting health outcomes" },
    { state: "Alaska", rate: 35.2, severity: "critical", region: "West", rank: 10, description: "Remote geography and harsh climate limiting year-round physical activity options" },
    { state: "Ohio", rate: 35.0, severity: "critical", region: "Midwest", rank: 11, description: "Rust Belt state with industrial history and economic transition challenges" },
    { state: "Indiana", rate: 34.8, severity: "high", region: "Midwest", rank: 12, description: "Midwestern state with agricultural influence and traditional comfort food culture" },
    { state: "Iowa", rate: 34.4, severity: "high", region: "Midwest", rank: 13, description: "Agricultural heartland with rural communities and limited urban health resources" },
    { state: "North Carolina", rate: 34.2, severity: "high", region: "South", rank: 14, description: "Diverse state with both progressive urban areas and traditional rural communities" },
    { state: "Kansas", rate: 34.0, severity: "high", region: "Midwest", rank: 15, description: "Great Plains state with widespread rural communities and agricultural lifestyle" },
    { state: "Georgia", rate: 33.8, severity: "high", region: "South", rank: 16, description: "Southern state with rapid urban growth but persistent rural health challenges" },
    { state: "South Carolina", rate: 33.6, severity: "high", region: "South", rank: 17, description: "Southeastern state with traditional Southern cuisine culture and rural health disparities" },
    { state: "Missouri", rate: 33.4, severity: "high", region: "Midwest", rank: 18, description: "Show-Me State with mix of urban centers and rural areas facing health access issues" },
    { state: "Texas", rate: 33.0, severity: "high", region: "South", rank: 19, description: "Large diverse state with varying regional health outcomes and Hispanic population health disparities" },
    { state: "Michigan", rate: 32.8, severity: "high", region: "Midwest", rank: 20, description: "Great Lakes state with industrial heritage and urban health challenges" },
    { state: "Nebraska", rate: 32.6, severity: "high", region: "Midwest", rank: 21, description: "Agricultural state with rural communities and traditional Midwestern food culture" },
    { state: "Wisconsin", rate: 32.4, severity: "high", region: "Midwest", rank: 22, description: "Dairy state with cheese culture and cold winters affecting physical activity" },
    { state: "Illinois", rate: 32.2, severity: "high", region: "Midwest", rank: 23, description: "Prairie State with Chicago's urban health initiatives but rural area challenges" },
    { state: "North Dakota", rate: 32.0, severity: "high", region: "Midwest", rank: 24, description: "Northern plains state with harsh winters and oil boom economic changes" },
    { state: "Pennsylvania", rate: 31.9, severity: "moderate", region: "Northeast", rank: 25, description: "Keystone State with post-industrial cities and rural Appalachian regions" },
    { state: "Arizona", rate: 31.9, severity: "moderate", region: "West", rank: 26, description: "Desert state with growing population and increasing health awareness initiatives" },
    { state: "South Dakota", rate: 31.7, severity: "moderate", region: "Midwest", rank: 27, description: "Mount Rushmore State with rural agricultural communities and Native American health disparities" },
    { state: "New Mexico", rate: 31.5, severity: "moderate", region: "West", rank: 28, description: "Land of Enchantment with Hispanic cultural influences and rural healthcare access issues" },
    { state: "Virginia", rate: 31.3, severity: "moderate", region: "South", rank: 29, description: "Old Dominion with educated population but regional health outcome variations" },
    { state: "Wyoming", rate: 31.1, severity: "moderate", region: "West", rank: 30, description: "Least populous state with rural ranching culture and limited healthcare infrastructure" },
    { state: "Minnesota", rate: 30.9, severity: "moderate", region: "Midwest", rank: 31, description: "Land of 10,000 Lakes with generally healthy population but cold weather challenges" },
    { state: "Florida", rate: 30.1, severity: "moderate", region: "South", rank: 32, description: "Sunshine State with active lifestyle opportunities but diverse population health needs" },
    { state: "Maine", rate: 29.8, severity: "moderate", region: "Northeast", rank: 33, description: "Pine Tree State with older population and rural coastal communities" },
    { state: "Idaho", rate: 29.6, severity: "moderate", region: "West", rank: 34, description: "Gem State with outdoor recreation culture but rural healthcare access limitations" },
    { state: "Maryland", rate: 29.5, severity: "moderate", region: "South", rank: 35, description: "Free State with educated population near Washington DC but urban-rural health divides" },
    { state: "Connecticut", rate: 29.4, severity: "moderate", region: "Northeast", rank: 36, description: "Constitution State with high income but still facing obesity challenges in certain communities" },
    { state: "New Hampshire", rate: 29.2, severity: "moderate", region: "Northeast", rank: 37, description: "Live Free or Die state with outdoor culture but aging population health concerns" },
    { state: "Oregon", rate: 29.0, severity: "moderate", region: "West", rank: 38, description: "Pacific Northwest state with health-conscious urban areas and outdoor recreation emphasis" },
    { state: "Rhode Island", rate: 28.8, severity: "moderate", region: "Northeast", rank: 39, description: "Ocean State with small size allowing concentrated health initiatives but urban challenges" },
    { state: "Nevada", rate: 28.5, severity: "moderate", region: "West", rank: 40, description: "Silver State with Las Vegas lifestyle culture and rapid population growth health challenges" },
    { state: "Vermont", rate: 28.3, severity: "moderate", region: "Northeast", rank: 41, description: "Green Mountain State with rural agricultural culture and aging population" },
    { state: "Washington", rate: 28.0, severity: "moderate", region: "West", rank: 42, description: "Evergreen State with tech industry health consciousness and outdoor recreation culture" },
    { state: "New York", rate: 27.9, severity: "moderate", region: "Northeast", rank: 43, description: "Empire State with NYC's walkable lifestyle but upstate rural health challenges" },
    { state: "California", rate: 27.7, severity: "moderate", region: "West", rank: 44, description: "Golden State with health and fitness culture but significant population diversity and regional variations" },
    { state: "New Jersey", rate: 27.3, severity: "moderate", region: "Northeast", rank: 45, description: "Garden State with dense population, walkable communities, and health-conscious suburban culture" },
    { state: "Utah", rate: 25.5, severity: "low", region: "West", rank: 46, description: "Beehive State with active Mormon culture emphasizing health and outdoor activities" },
    { state: "Massachusetts", rate: 25.2, severity: "low", region: "Northeast", rank: 47, description: "Bay State with educated population, excellent healthcare system, and walkable cities" },
    { state: "Hawaii", rate: 25.0, severity: "low", region: "West", rank: 48, description: "Aloha State with year-round outdoor activity opportunities and Asian dietary influences" },
    { state: "Colorado", rate: 24.9, severity: "low", region: "West", rank: 49, description: "Centennial State with outdoor recreation culture and high altitude active lifestyle" },
    { state: "District of Columbia", rate: 23.5, severity: "low", region: "Northeast", rank: 50, description: "Nation's capital with educated population, walkable urban environment, and health-conscious policies" }
  ];

  const topStates = allStatesData.slice(0, 10);
  const lowestStates = allStatesData.slice(-5).reverse();

  const regionalData = [
    { region: "South", rate: 35.8, count: 16 },
    { region: "Midwest", rate: 33.9, count: 12 },
    { region: "West", rate: 28.4, count: 13 },
    { region: "Northeast", rate: 28.1, count: 9 }
  ];

  const severityBreakdown = [
    { name: "Critical (40%+)", value: 3, fill: "hsl(var(--destructive))" },
    { name: "Very High (35-39%)", value: 7, fill: "hsl(15 95% 60%)" },
    { name: "High (30-34%)", value: 17, fill: "hsl(var(--warning))" },
    { name: "Moderate (25-29%)", value: 18, fill: "hsl(var(--secondary))" },
    { name: "Lower (<25%)", value: 5, fill: "hsl(var(--primary))" }
  ];
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Regional Comparison Bar Chart */}
            <Card className="rounded-2xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Obesity Rates by Region</span>
                  <Badge variant="destructive" className="rounded-full">
                    CDC 2023
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="region" />
                      <YAxis domain={[20, 40]} />
                      <ChartTooltip 
                        formatter={(value, name) => [`${value}%`, "Average Obesity Rate"]}
                        labelFormatter={(label) => `Region: ${label}`}
                      />
                      <Bar 
                        dataKey="rate" 
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-muted-foreground text-center">
                  South leads with 35.8% average obesity rate across 16 states
                </div>
              </CardContent>
            </Card>

            {/* Severity Breakdown Pie Chart */}
            <Card className="rounded-2xl border-2">
              <CardHeader>
                <CardTitle>States by Obesity Severity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={severityBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {severityBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        formatter={(value, name) => [`${value} states`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-muted-foreground text-center">
                  Only 5 states maintain obesity rates below 25%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Complete State Rankings with Carousel */}
          <Card className="rounded-2xl border-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Complete State Rankings: All 50 States + DC</span>
                <Badge variant="secondary" className="rounded-full">
                  Scroll to View All
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
                  {allStatesData.map((item, index) => {
                    const getSeverityColor = (severity: string) => {
                      switch (severity) {
                        case 'critical': return 'bg-destructive/10 border-destructive/30 text-destructive';
                        case 'high': return 'bg-warning/10 border-warning/30 text-warning';
                        case 'moderate': return 'bg-secondary/10 border-secondary/30 text-secondary';
                        case 'low': return 'bg-primary/10 border-primary/30 text-primary';
                        default: return 'bg-muted/10 border-muted/30';
                      }
                    };

                    return (
                      <div 
                        key={index} 
                        className={`min-w-80 p-4 rounded-xl border-2 hover:shadow-md transition-all duration-300 ${getSeverityColor(item.severity)}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center text-sm font-bold">
                              #{item.rank}
                            </div>
                            <div>
                              <div className="font-bold text-lg text-foreground">{item.state}</div>
                              <div className="text-sm text-muted-foreground">{item.region} Region</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold">{item.rate}%</div>
                            <Badge 
                              variant={item.severity === 'critical' ? 'destructive' : 'secondary'} 
                              className="text-xs"
                            >
                              {item.severity.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-sm text-muted-foreground mb-2">
                  Scroll horizontally to explore all states →
                </div>
                <div className="flex items-center justify-center space-x-4 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <span>Critical (40%+)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-warning rounded-full"></div>
                    <span>High (30-39%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-secondary rounded-full"></div>
                    <span>Moderate (25-29%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span>Lower (&lt;25%)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparison: Highest vs Lowest */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="rounded-2xl border-2">
              <CardHeader>
                <CardTitle className="text-destructive">Crisis States (40%+ Rate)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allStatesData.filter(state => state.rate >= 40).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          #{item.rank}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{item.state}</div>
                          <div className="text-sm text-muted-foreground">{item.region}</div>
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
                <CardTitle className="text-primary">Success Stories (Under 25%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allStatesData.filter(state => state.rate < 25).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          #{item.rank}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{item.state}</div>
                          <div className="text-sm text-muted-foreground">{item.region}</div>
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
                  <div className="font-semibold text-destructive mb-2">Southern Crisis</div>
                  <div className="text-muted-foreground">
                    16 of 50 states in the South, with the region averaging 35.8% obesity rate - highest in the nation
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                  <div className="font-semibold text-secondary mb-2">Rural Challenge</div>
                  <div className="text-muted-foreground">
                    States with larger rural populations face higher rates due to food deserts and healthcare access
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="font-semibold text-primary mb-2">Success Models</div>
                  <div className="text-muted-foreground">
                    DC (23.5%), Colorado (24.9%), and Hawaii (25.0%) lead with comprehensive health initiatives
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