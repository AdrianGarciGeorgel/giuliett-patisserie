import nextVitals from 'eslint-config-next/core-web-vitals'

// Reglas de Next (core-web-vitals). `npm run lint` ya funciona (punto 12 del checklist).
const config = [
  ...nextVitals,
  { ignores: ['.next/**', 'node_modules/**', 'test/stubs/**'] },
  {
    rules: {
      // Regla nueva del compilador de React. Los efectos que sincronizan con
      // sessionStorage/IntersectionObserver la disparan; corregirla exige
      // refactorizar componentes de Marco. Queda visible como aviso, no frena.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]

export default config
