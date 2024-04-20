import { Option } from 'effect'
import type React from 'react'

export default function Opt(props: {
  children: Option.Option<React.ReactNode>
}) {
  return Option.getOrNull(props.children)
}
