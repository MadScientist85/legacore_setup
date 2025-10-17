import Head from "next/head"

interface SEOHeadProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: "website" | "article"
  keywords?: string[]
}

export function SEOHead({
  title = "LegaCore | Aurelian Digital - AI-Powered Legal Automation",
  description = "Enterprise-grade AI legal automation platform. Streamline surplus funds recovery, credit repair, trust management, and more with intelligent AI agents.",
  image = "/og-image.jpg",
  url = "https://legacore.aurelian.digital",
  type = "website",
  keywords = ["legal automation", "AI legal assistant", "surplus funds", "credit repair", "legal tech"],
}: SEOHeadProps) {
  const fullTitle = title.includes("LegaCore") ? title : `${title} | LegaCore`

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Theme */}
      <meta name="theme-color" content="#4B0082" />
    </Head>
  )
}
