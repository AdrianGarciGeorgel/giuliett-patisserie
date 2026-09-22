import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Panel · Giuliett Pâtisserie',
  robots: { index: false, follow: false },
}

/** El panel no lleva el nav del sitio (lo oculta GlobalNavigation) ni sus animaciones. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-background text-primary">{children}</div>
}
