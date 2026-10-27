import { Fragment } from 'react'
// Isolate complete identifiers and numeric expressions; never insert bidi characters into data.
const CODE = /(10\.\d{4,9}\/[^\s<>،؛)]+|\b[A-Za-z][A-Za-z0-9]*(?:[_-][A-Za-z0-9]+)+|\d{4}-\d{2}-\d{2}|m\.\d+(?:[ACGT>]+(?:\/[ACGT])?|del[ACGT]?)|MT-[A-Z0-9]+|(?:PGT-mt|PGT-A|PGT-M|mtDNA|DNA|rCRS|ARMS-qPCR|ddPCR|ICM\+TE|ICM|TE|WGA|NGS|PCR|VUS|HV2)|[<>≤≥]?[−+]?\d+(?:[.,]\d+)*(?:[–−/]\d+(?:\.\d+)*)?%?)/g
export function ScientificText({ text }: { text: string }) {
  return <>{text.split(CODE).map((part, i) => i % 2 ? <bdi dir="ltr" key={i}>{part}</bdi> : <Fragment key={i}>{part}</Fragment>)}</>
}
