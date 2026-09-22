import { cn } from '@/lib/utils'

type Size = 'sm' | 'md' | 'lg'

const SIZES: Record<Size, { caps: string; script: string; overlap: string }> = {
  // banda de respiro: sólo mayúsculas pequeñas
  sm: { caps: 'text-[13px] md:text-[14px]', script: 'text-[28px] md:text-[32px]', overlap: '-mt-2.5' },
  // estándar de sección
  md: { caps: 'text-[17px] md:text-[20px]', script: 'text-[36px] md:text-[46px]', overlap: '-mt-3.5 md:-mt-4' },
  // hero y cierre
  lg: { caps: 'text-[20px] md:text-[30px]', script: 'text-[52px] md:text-[74px]', overlap: '-mt-4 md:-mt-6' },
}

type Props = {
  /** id del encabezado, para `aria-labelledby` de la sección. */
  id?: string
  /** Línea superior en mayúsculas tracked. */
  caps: string
  /** Palabra emocional en caligrafía. Monta sobre la mayúscula. */
  script?: string
  size?: Size
  align?: 'center' | 'left'
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  capsClassName?: string
  scriptClassName?: string
}

/**
 * La firma tipográfica de la marca.
 * Mayúsculas tracked coronadas por una palabra manuscrita que monta
 * y se desplaza a la derecha. El desfase es deliberado: produce la
 * tensión entre técnica francesa y alma artesanal.
 */
export function SectionLockup({
  id,
  caps,
  script,
  size = 'md',
  align = 'center',
  as: Tag = 'h2',
  className,
  capsClassName,
  scriptClassName,
}: Props) {
  const s = SIZES[size]

  return (
    <Tag
      id={id}
      className={cn(
        'flex flex-col text-balance',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      <span className={cn('tracked font-medium leading-[1.15] text-primary', s.caps, capsClassName)}>{caps}</span>
      {script ? (
        <span
          className={cn(
            'font-script leading-[0.95] text-primary',
            s.script,
            s.overlap,
            align === 'center' ? 'translate-x-[10px]' : 'translate-x-[12px]',
            scriptClassName,
          )}
        >
          {script}
        </span>
      ) : null}
    </Tag>
  )
}
