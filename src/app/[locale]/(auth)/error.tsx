"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
  const t = useTranslations("GlobalError");
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-semibold">{t("title")}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-3 bg-muted rounded-md text-left">
              <p className="text-sm font-mono text-muted-foreground break-all">{error.message}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={reset} className="w-full" variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("tryAgain")}
          </Button>
          <Link href="/"
            className="flex w-full justify-center h-10 items-center rounded-md bg-primary px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-primary dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            prefetch={false}>
            <Home className="mr-2 h-4 w-4" />
            {t("goHome")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
