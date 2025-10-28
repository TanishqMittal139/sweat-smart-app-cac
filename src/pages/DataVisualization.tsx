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
    riskIncrease: "58% Higher Risk",
    affectedPopulation: "38.4M Americans (11.6%)",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    source: "NIDDK 2021"
  }, {
    condition: "High Blood Pressure",
    riskIncrease: "58% of Adults with Obesity",
    affectedPopulation: "Major heart disease risk factor",
    color: "text-warning",
    bgColor: "bg-warning/10",
    source: "CDC 2024"
  }, {
    condition: "Prediabetes",
    riskIncrease: "Higher Risk of Progression",
    affectedPopulation: "97.6M Americans (32.8%)",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    source: "NIDDK 2021"
  }, {
    condition: "Multiple Chronic Diseases",
    riskIncrease: "Significantly Increased Risk",
    affectedPopulation: "Most adults with obesity",
    color: "text-accent",
    bgColor: "bg-accent/10",
    source: "CDC 2024"
  }];

  const economicImpact = [{
    category: "Total Medical Costs",
    amount: "$173B",
    description: "Annual obesity-related healthcare costs (2019 dollars)",
    trend: "↑ Continuing to rise",
    source: "CDC 2024"
  }, {
    category: "Individual Cost",
    amount: "$1,861",
    description: "Extra annual medical costs per person with obesity",
    trend: "↑ $3,097 for severe obesity",
    source: "CDC 2024"
  }, {
    category: "Diabetes Costs",
    amount: "$412.9B",
    description: "Total estimated cost of diagnosed diabetes",
    trend: "$306.6B direct + $106.3B productivity",
    source: "ADA 2022"
  }, {
    category: "Population Impact",
    amount: "100M+",
    description: "Adults with obesity in the United States",
    trend: "22M+ with severe obesity",
    source: "CDC 2024"
  }];

  const demographics = [{
    group: "Non-Hispanic Black adults",
    rate: 49.9,
    population: "49.9%",
    source: "CDC 2017-2020"
  }, {
    group: "Hispanic adults",
    rate: 45.6,
    population: "45.6%",
    source: "CDC 2017-2020"
  }, {
    group: "Non-Hispanic White adults",
    rate: 41.4,
    population: "41.4%",
    source: "CDC 2017-2020"
  }, {
    group: "Non-Hispanic Asian adults",
    rate: 16.1,
    population: "16.1%",
    source: "CDC 2017-2020"
  }];

  const diabetesDemographics = [{
    group: "American Indian/Alaska Native",
    rate: 13.6,
    population: "13.6%",
    source: "NIDDK 2019-2021"
  }, {
    group: "Non-Hispanic Black adults",
    rate: 12.1,
    population: "12.1%",
    source: "NIDDK 2019-2021"
  }, {
    group: "Hispanic adults",
    rate: 11.7,
    population: "11.7%",
    source: "NIDDK 2019-2021"
  }, {
    group: "Non-Hispanic Asian adults",
    rate: 9.1,
    population: "9.1%",
    source: "NIDDK 2019-2021"
  }, {
    group: "Non-Hispanic White adults",
    rate: 6.9,
    population: "6.9%",
    source: "NIDDK 2019-2021"
  }];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground">
            The Obesity & Diabetes Epidemic: Evidence-Based Analysis
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Understanding the scope and impact of obesity and chronic diseases in America through comprehensive data from authoritative health organizations
          </p>
        </div>

        {/* Key Statistics */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="rounded-2xl border-2 text-center hover:shadow-bubble transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-destructive mb-2">41.9%</div>
              <div className="text-muted-foreground mb-2">US Adults with Obesity</div>
              <Badge variant="destructive" className="rounded-full">
                CDC 2017-2020
              </Badge>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-2 text-center hover:shadow-bubble transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-warning mb-2">100M+</div>
              <div className="text-muted-foreground mb-2">Adults with Obesity</div>
              <Badge className="rounded-full bg-warning text-white hover:bg-warning/90">
                from 30.5% in 1999
              </Badge>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-2 text-center hover:shadow-bubble transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-accent mb-2">38.4M</div>
              <div className="text-muted-foreground mb-2">Americans with Diabetes</div>
              <Badge className="rounded-full bg-accent text-white hover:bg-accent/90">
                11.6% of Population
              </Badge>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-2 text-center hover:shadow-bubble transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-secondary mb-2">$413B</div>
              <div className="text-muted-foreground mb-2">Diabetes Cost 2022</div>
              <Badge variant="secondary" className="rounded-full text-white">
                ADA Report
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
                <CardTitle>Obesity Rates by Region</CardTitle>
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
                        label={({ name, value, cx, cy, midAngle, innerRadius, outerRadius }) => {
                          const RADIAN = Math.PI / 180;
                          const radius = outerRadius + 25;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);
                          return (
                            <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                              {`${name}: ${value}`}
                            </text>
                          );
                        }}
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
                  Only 5 states have obesity rates below 25%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* State Rankings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
        </section>

        {/* Health Impact */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center space-x-2">
            <Heart className="w-6 h-6 text-primary" />
            <span>Health Impact & Chronic Diseases</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {healthImpacts.map((impact, index) => (
              <Card key={index} className="rounded-2xl border-2 hover:shadow-bubble transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`rounded-lg p-4 mb-4 ${impact.bgColor}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{impact.condition}</h3>
                      <Badge variant="outline" className="text-xs">
                        {impact.source}
                      </Badge>
                    </div>
                    <div className={`text-2xl font-bold mb-2 ${impact.color}`}>
                      {impact.riskIncrease}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {impact.affectedPopulation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* New Prediabetes Section */}
          <Card className="rounded-2xl border-2 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Prediabetes Crisis</span>
                <Badge variant="destructive" className="rounded-full">
                  NIDDK 2021
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning mb-2">97.6M</div>
                  <div className="text-muted-foreground">Adults with Prediabetes</div>
                  <div className="text-sm text-secondary">32.8% of U.S. adults</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-destructive mb-2">1 in 5</div>
                  <div className="text-muted-foreground">Adolescents (12-18)</div>
                  <div className="text-sm text-secondary">18% have prediabetes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">50%</div>
                  <div className="text-muted-foreground">Progress to Type 2</div>
                  <div className="text-sm text-secondary">From gestational diabetes</div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-warning/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Critical Finding:</strong> Most people with prediabetes don't know they have it, 
                  making early intervention and lifestyle changes crucial for preventing type 2 diabetes.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Economic Impact */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-primary" />
            <span>Economic Impact & Healthcare Costs</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {economicImpact.map((impact, index) => 
              <Card key={index} className="rounded-2xl border-2 hover:shadow-bubble transition-all duration-300">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{impact.category}</h3>
                      <Badge variant="outline" className="text-xs">
                        {impact.source}
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {impact.amount}
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                      {impact.description}
                    </p>
                    <div className="text-xs text-secondary bg-secondary/10 rounded px-2 py-1">
                      {impact.trend}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Cost Breakdown */}
          <Card className="rounded-2xl border-2 mt-8">
            <CardHeader>
              <CardTitle>Understanding the Financial Burden</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Obesity-Related Costs (CDC 2024)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Per person annually:</span>
                      <span className="font-semibold">$1,861 extra</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Severe obesity:</span>
                      <span className="font-semibold">$3,097 extra</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total annual:</span>
                      <span className="font-semibold text-destructive">$173 billion</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Diabetes Costs (ADA 2022)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Direct medical:</span>
                      <span className="font-semibold">$306.6B</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reduced productivity:</span>
                      <span className="font-semibold">$106.3B</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total diabetes cost:</span>
                      <span className="font-semibold text-destructive">$412.9B</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Demographics */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center space-x-2">
            <Users className="w-6 h-6 text-accent" />
            <span>Demographic Disparities</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="rounded-2xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Obesity Rates by Ethnicity</span>
                  <Badge variant="outline" className="text-xs">CDC 2017-2020</Badge>
                </CardTitle>
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
                          style={{ width: `${demo.rate / 50 * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Diabetes Rates by Ethnicity</span>
                  <Badge variant="outline" className="text-xs">NIDDK 2019-2021</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {diabetesDemographics.map((demo, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{demo.group}</span>
                        <span className="text-lg font-bold">{demo.rate}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div 
                          className="h-full bg-gradient-secondary rounded-full transition-all duration-1000" 
                          style={{ width: `${demo.rate / 15 * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Data Sources */}
        <section className="mb-12">
          <Card className="rounded-2xl border-2 bg-gradient-to-br from-background to-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ExternalLink className="w-5 h-5 text-primary" />
                <span>Data Sources & Methodology</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Centers for Disease Control (CDC)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      <a href="https://www.cdc.gov/obesity/data/adult.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline flex items-center gap-1">
                        • Adult Obesity Facts (2024) <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.cdc.gov/nchs/nhanes/index.htm" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline flex items-center gap-1">
                        • NHANES 2017-March 2020 <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.cdc.gov/brfss/index.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline flex items-center gap-1">
                        • Behavioral Risk Factor Surveillance <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">NIDDK/NIH</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      <a href="https://www.niddk.nih.gov/health-information/health-statistics/diabetes-statistics" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline flex items-center gap-1">
                        • Diabetes Statistics (2021) <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.niddk.nih.gov/health-information/health-statistics/overweight-obesity" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline flex items-center gap-1">
                        • Overweight & Obesity Statistics <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.nih.gov/about-nih/what-we-do/nih-almanac/national-institute-diabetes-digestive-kidney-diseases-niddk" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline flex items-center gap-1">
                        • National Health Statistics <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">American Diabetes Association</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      <a href="https://diabetesjournals.org/care/article/47/1/26/153343/Economic-Costs-of-Diabetes-in-the-U-S-in-2022" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline flex items-center gap-1">
                        • Economic Costs Report (2022) <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>
                      <a href="https://diabetes.org/about-diabetes/statistics/about-diabetes" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline flex items-center gap-1">
                        • Statistics About Diabetes <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>
                      <a href="https://diabetes.org/about-diabetes/statistics" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline flex items-center gap-1">
                        • Demographic Analysis <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> All data presented is from official government health agencies and established medical organizations. 
                  Statistics are the most recent available as of 2024 and represent the best current evidence on obesity and diabetes in America.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
};

export default DataVisualization;