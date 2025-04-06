import { Outfit } from "next/font/google";
import "./globals.css";

// compoenents
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// theme provider
import { ThemeProvider } from "@/components/ThemeProvider";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Tâm Giao Coffee - Hương vị đậm đà, kết nối tâm hồn",
  description:
    "Thưởng thức cà phê nguyên chất từ Tâm Giao Coffee, nơi kết nối những tâm hồn yêu cà phê.",
  keywords: [
    "Tâm Giao Coffee",
    "cà phê nguyên chất",
    "cà phê sạch",
    "specialty coffee",
    "cà phê rang xay",
  ],
  openGraph: {
    title: "Tâm Giao Coffee - Hương vị đậm đà, kết nối tâm hồn",
    description:
      "Thưởng thức cà phê nguyên chất từ Tâm Giao Coffee, nơi kết nối những tâm hồn yêu cà phê.",
    url: "https://tamgiaocoffee.com",
    siteName: "Tâm Giao Coffee",
    images: [
      {
        url: "https://tamgiaocoffee.com/thumbnail.jpg",
        width: 1200,
        height: 630,
        alt: "Tâm Giao Coffee",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tâm Giao Coffee - Hương vị đậm đà, kết nối tâm hồn",
    description:
      "Thưởng thức cà phê nguyên chất từ Tâm Giao Coffee, nơi kết nối những tâm hồn yêu cà phê.",
    images: ["https://tamgiaocoffee.com/thumbnail.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
