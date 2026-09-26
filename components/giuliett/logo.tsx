import Image from 'next/image'

/** Marca compacta para el navbar global. */
export function Logo() {
  return (
    <span className="flex flex-col items-center justify-center">
      <Image
        src="/images/giuliett-logo.png"
        alt="Giuliett Pâtisserie"
        width={3500}
        height={1700}
        sizes="112px"
        className="h-auto w-[300px] object-contain"
      />
      <span className="mt-0.5 text-center text-[14px] uppercase tracking-[0.08em] text-muted-foreground">
        Pastelería Francesa · Mendoza, Argentina
      </span>
    </span>
  )
}
