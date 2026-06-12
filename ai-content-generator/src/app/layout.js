import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata = {
  title: "NOVA — AI Creative Studio",
  description: "Generate stunning AI images and videos. Where imagination becomes reality.",
};

const themeInitScript = `(function(){try{var t=localStorage.getItem("nova-theme")||"light";document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","light")}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.className} ${inter.variable} ${spaceGrotesk.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
