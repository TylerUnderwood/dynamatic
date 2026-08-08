import type { Plugin, PluginCreator, Declaration, AtRule, Rule } from 'postcss'

type ScaleOptions = {
  /** 'clamp' (default) or 'media' to mirror the SCSS mixin */
  output?: 'clamp' | 'media'
}

type ParsedLength = {
  value: number
  unit: string
  raw: string
}

const CLAMP_MIN_MAX_RE = /fluidLength\(\s*([^)]+)\s*\)/g

function parseLength(raw: string): ParsedLength {
  const trimmed = raw.trim()
  const match = trimmed.match(/^(-?[\d.]+)([a-z%]*)$/i)

  if (!match) {
    throw new Error(`Invalid length in fluidLength(): "${raw}"`)
  }

  return {
    value: Number(match[1]),
    unit: match[2] || '',
    raw: trimmed,
  }
}

function fluidCalc(min: ParsedLength, max: ParsedLength, minVw: ParsedLength, maxVw: ParsedLength) {
  const valueDelta = max.value - min.value
  const vwDelta = maxVw.value - minVw.value

  // Same formula as _scale.scss
  return `calc(${min.raw} + ${valueDelta} * (100vw - ${minVw.raw}) / ${vwDelta})`
}

function toClamp(min: ParsedLength, max: ParsedLength, minVw: ParsedLength, maxVw: ParsedLength) {
  return `clamp(${min.raw}, ${fluidCalc(min, max, minVw, maxVw)}, ${max.raw})`
}

function parseFluidLengthArgs(args: string) {
  const parts = args.split(',').map((part) => part.trim())

  if (parts.length !== 4) {
    throw new Error(
      `fluidLength() expects 4 arguments: fluidLength(min, max, minVw, maxVw). Got: fluidLength(${args})`
    )
  }

  const [min, max, minVw, maxVw] = parts.map(parseLength)

  if (min.unit !== max.unit) {
    throw new Error(`fluidLength() min/max units must match: ${min.raw}, ${max.raw}`)
  }

  if (minVw.unit !== maxVw.unit) {
    throw new Error(`fluidLength() viewport units must match: ${minVw.raw}, ${maxVw.raw}`)
  }

  return { min, max, minVw, maxVw }
}

const fluidLength: PluginCreator<ScaleOptions> = (opts = {}) => {
  const output = opts.output ?? 'clamp'

  return {
    postcssPlugin: 'postcss-fluid-scale',

    Declaration(decl) {
      if (!decl.value.includes('fluidLength(')) return

      const parent = decl.parent
      if (!parent || parent.type !== 'rule') return

      const rule = parent as Rule
      let mediaMin: AtRule | null = null
      let mediaMid: AtRule | null = null
      let mediaMax: AtRule | null = null

      const nextValue = decl.value.replace(CLAMP_MIN_MAX_RE, (_, args: string) => {
        const { min, max, minVw, maxVw } = parseFluidLengthArgs(args)

        if (output === 'clamp') {
          return toClamp(min, max, minVw, maxVw)
        }

        // media mode: base = min, then two @media blocks
        if (!mediaMin) {
          mediaMid = decl.root().append({
            name: 'media',
            params: `(min-width: ${minVw.value + 1}${minVw.unit}) and (max-width: ${maxVw.value - 1}${maxVw.unit})`,
          }).last as AtRule

          mediaMax = decl.root().append({
            name: 'media',
            params: `(min-width: ${maxVw.raw})`,
          }).last as AtRule

          const midRule = mediaMid.append({ selector: rule.selector }).first as Rule
          const maxRule = mediaMax.append({ selector: rule.selector }).first as Rule

          midRule.append({
            prop: decl.prop,
            value: fluidCalc(min, max, minVw, maxVw),
            important: decl.important,
          })

          maxRule.append({
            prop: decl.prop,
            value: max.raw,
            important: decl.important,
          })
        }

        return min.raw
      })

      decl.value = nextValue
    },
  } satisfies Plugin
}

fluidLength.postcss = true

export default fluidLength
