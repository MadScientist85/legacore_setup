"use client"

import { useState } from "react"
import { Lightbulb, TrendingUp, AlertTriangle, Users, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function InsightsDashboard() {
  const [loading, setLoading] = useState(false)
  const [insights, setInsights] = useState<any>(null)
  const [predictions, setPredictions] = useState<any>(null)
  const [anomalies, setAnomalies] = useState<any>(null)
  const [segmentation, setSegmentation] = useState<any>(null)

  const generateInsights = async (type: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/insights/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, timeRange: 30 }),
      })
      const data = await response.json()

      if (type === "overview") {
        setInsights(data.insights)
      } else if (type === "predictions") {
        setPredictions(data.insights)
      } else if (type === "anomalies") {
        setAnomalies(data.insights)
      }
    } catch (error) {
      console.error("Error generating insights:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadSegmentation = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/insights/segmentation")
      const data = await response.json()
      setSegmentation(data.segmentation)
    } catch (error) {
      console.error("Error loading segmentation:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">AI-Powered Insights</h2>
          <p className="text-muted-foreground">Discover trends, predictions, and actionable recommendations</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Business Overview</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
          <TabsTrigger value="segmentation">User Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Business Insights
              </CardTitle>
              <CardDescription>AI-generated analysis of your business performance</CardDescription>
            </CardHeader>
            <CardContent>
              {!insights ? (
                <div className="text-center py-12">
                  <Button onClick={() => generateInsights("overview")} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Generate Insights
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap bg-muted p-4 rounded-lg">{insights.business}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateInsights("overview")}
                    disabled={loading}
                    className="mt-4"
                  >
                    Regenerate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Revenue Predictions
              </CardTitle>
              <CardDescription>Next 7 days revenue forecast</CardDescription>
            </CardHeader>
            <CardContent>
              {!predictions ? (
                <div className="text-center py-12">
                  <Button onClick={() => generateInsights("predictions")} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Generate Predictions
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Trend</div>
                      <div className="text-2xl font-bold capitalize">{predictions.revenue.trend}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">Confidence</div>
                      <div className="text-2xl font-bold">{predictions.revenue.confidence.toFixed(1)}%</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">7-Day Forecast</div>
                      <div className="text-2xl font-bold">
                        ${predictions.revenue.predictions.reduce((a: number, b: number) => a + b, 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Daily Predictions:</h4>
                    {predictions.revenue.predictions.map((pred: number, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span>
                          Day {idx + 1} ({new Date(Date.now() + (idx + 1) * 24 * 60 * 60 * 1000).toLocaleDateString()})
                        </span>
                        <span className="font-semibold">${pred.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Anomaly Detection
              </CardTitle>
              <CardDescription>Unusual patterns in your data</CardDescription>
            </CardHeader>
            <CardContent>
              {!anomalies ? (
                <div className="text-center py-12">
                  <Button onClick={() => generateInsights("anomalies")} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Detect Anomalies
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Revenue Anomalies</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={anomalies.anomalies.revenue.severity === "high" ? "destructive" : "secondary"}>
                        {anomalies.anomalies.revenue.severity} severity
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {anomalies.anomalies.revenue.anomalies.length} anomalies detected
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">User Growth Anomalies</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={anomalies.anomalies.users.severity === "high" ? "destructive" : "secondary"}>
                        {anomalies.anomalies.users.severity} severity
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {anomalies.anomalies.users.anomalies.length} anomalies detected
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segmentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                User Segmentation
              </CardTitle>
              <CardDescription>Understand your user base with AI-powered segmentation</CardDescription>
            </CardHeader>
            <CardContent>
              {!segmentation ? (
                <div className="text-center py-12">
                  <Button onClick={loadSegmentation} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4 mr-2" />
                        Analyze Users
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {segmentation.segments.map((segment: any, idx: number) => (
                    <Card key={idx}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{segment.name}</CardTitle>
                          <Badge>{segment.count} users</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <h5 className="text-sm font-semibold mb-1">Characteristics:</h5>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {segment.characteristics.map((char: string, i: number) => (
                              <li key={i}>• {char}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold mb-1">Recommendations:</h5>
                          <ul className="text-sm space-y-1">
                            {segment.recommendations.map((rec: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
