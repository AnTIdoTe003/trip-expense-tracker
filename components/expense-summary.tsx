"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, FileText, Download, MessageCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { WhatsAppShareModal } from "./whatsapp-share-modal"
import { formatForWhatsApp, truncateForWhatsApp, createWhatsAppShareUrl } from "@/lib/whatsapp-formatter"

interface ExpenseSummaryProps {
  tripId: string
  tripName: string
}

export function ExpenseSummary({ tripId, tripName }: ExpenseSummaryProps) {
  const [summary, setSummary] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showSummary, setShowSummary] = useState(false)
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)

  const generateSummary = async () => {
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`/api/trips/${tripId}/summary`, {
        method: "POST",
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate summary")
      }

      setSummary(data.summary)
      setShowSummary(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate summary")
    } finally {
      setLoading(false)
    }
  }

  const downloadSummary = () => {
    const blob = new Blob([`# ${tripName} - Expense Summary\n\n${summary}`], {
      type: "text/markdown",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${tripName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_expense_summary.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareToWhatsApp = () => {
    setShowWhatsAppModal(true)
  }

  if (!showSummary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            AI Expense Summary
          </CardTitle>
          <CardDescription>
            Generate an intelligent summary of your trip expenses with insights and settlement recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button onClick={generateSummary} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Summary...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate AI Summary
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              💡 Once generated, you can share the summary directly to WhatsApp
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              AI Expense Summary
            </CardTitle>
            <CardDescription>Generated analysis of your trip expenses</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={shareToWhatsApp}>
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            <Button variant="outline" size="sm" onClick={downloadSummary}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSummary(false)}>
              Hide
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown
            components={{
              table: ({ children }) => (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
              th: ({ children }) => (
                <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">{children}</th>
              ),
              td: ({ children }) => <td className="px-4 py-2 text-sm">{children}</td>,
              tr: ({ children }) => <tr className="border-b border-border">{children}</tr>,
            }}
          >
            {summary}
          </ReactMarkdown>
        </div>

        <div className="mt-6 pt-4 border-t">
          <Button onClick={generateSummary} disabled={loading} variant="outline" size="sm">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Regenerating...
              </>
            ) : (
              "Regenerate Summary"
            )}
          </Button>
        </div>
      </CardContent>

      <WhatsAppShareModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        summary={summary}
        tripName={tripName}
      />
    </Card>
  )
}
