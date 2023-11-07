'use client'

import { Co2Average } from '@/domain/co2'
import {
  calcCo2PerConsumption,
  calcCo2PerYear,
  calcFactorOfPersonYearFootprint,
} from '@/domain/co2/personal-co2'
import { format } from '@/lib/utils'
import convert from 'convert'
import { useState } from 'react'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Slider } from './ui/slider'

export default function PersonalCo2({
  co2Average,
}: {
  co2Average: Co2Average
}) {
  const [consumption, setConsumption] = useState(
    co2Average.singleConsumptionAverage
  )
  const [times, setTimes] = useState(co2Average.timesPerYearAverage)
  const co2PerConsumption = calcCo2PerConsumption(
    co2Average.avgPerUnit,
    consumption
  )
  const co2PerYear = calcCo2PerYear(times, co2PerConsumption)
  const factorOfPersonYearFootprint =
    calcFactorOfPersonYearFootprint(co2PerYear)

  const { isLeft, angleMask } = calculateAngles(factorOfPersonYearFootprint)

  return (
    <div className="rounded-lg border border-border bg-card p-8">
      <div className="flex flex-col justify-between gap-x-24 gap-y-8 lg:flex-row">
        <div className="flex-1">
          <h2 className="text-lg font-bold">
            Personal CO<sub>2</sub> footprint
          </h2>

          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <p>
                CO<sub>2</sub>e per consumption
              </p>
              <p className="text-2xl">
                <b>{format(convert(co2PerConsumption, 'grams').to('kg'))}</b>
                &nbsp;kg
              </p>
            </div>
            <div className="flex items-baseline justify-between">
              <p>
                CO
                <sub>2</sub>e per year
              </p>
              <p className="text-2xl">
                <b>{format(convert(co2PerYear, 'grams').to('kg'))}</b>
                &nbsp;kg
              </p>
            </div>
          </div>
          <div className="mt-8 block touch-pan-y">
            <label htmlFor="amountInput">
              <div className="flex justify-between">
                <div>Single consumption</div>
                <div>
                  <b>{consumption}</b>&ensp;
                  {co2Average.unit}
                </div>
              </div>
            </label>
            <Slider
              id="amountInput"
              className="mt-3"
              min={co2Average.singleConsumptionFrom}
              max={co2Average.singleConsumptionTo}
              step={
                (co2Average.singleConsumptionTo -
                  co2Average.singleConsumptionFrom) /
                50
              }
              value={[consumption]}
              onValueChange={(value) => setConsumption(value.at(0) ?? 0)}
            />
            <label htmlFor="timesPerYearInput" className="mt-2 block">
              <div className="flex justify-between">
                <div>Times per year</div>
                <div>
                  &times;&nbsp;<b>{times}</b>
                </div>
              </div>
            </label>
            <Slider
              id="timesPerYearInput"
              className="my-3"
              min={co2Average.timesPerYearFrom}
              max={co2Average.timesPerYearTo}
              step={
                (co2Average.timesPerYearTo - co2Average.timesPerYearFrom) /
                Math.min(
                  co2Average.timesPerYearTo - co2Average.timesPerYearFrom,
                  50
                )
              }
              value={[times]}
              // onInput={(e) => setTimes(e)}
              onValueChange={(value) => setTimes(value.at(0) ?? 0)}
            />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-center font-bold">
            Percentage of yearly average
          </h3>
          <div className="mx-auto flex max-w-md justify-around px-12">
            <svg className="absolute h-0 w-0">
              <defs>
                <mask id="segmentMask">
                  <polygon
                    points="150,-150 350,-150 350,350 150,350"
                    fill="white"
                    transform={'rotate(0 150,100)'}
                  />
                  <polygon
                    points="150,-150 350,-150 350,350 150,350"
                    fill={isLeft ? 'white' : 'black'}
                    transform={`rotate(${angleMask} 150,100)`}
                  />
                </mask>
              </defs>
            </svg>
            {generatePieParts(factorOfPersonYearFootprint).map((state) => (
              <PieChart key={Math.random()} state={state} />
            ))}
          </div>
          <div className="tooltip-container text-center">
            <b>{Math.round(co2PerYear / 60000)} %</b>
            <br />
            of the <b>total</b> CO<sub>2</sub>e Footprint{' '}
            <span className="whitespace-nowrap">
              of a{' '}
              <svg
                viewBox="0 -2 20 55"
                className="inline-block h-6 w-2 -translate-y-1 fill-current"
              >
                <circle cx="9" cy="9" r="4" />
                <path d="M9,32l0,19l4,0l0,-30l1,0l0,13l3,0l0,-18l-18,0l0,18l3,0l0,-13l1,0l-0,30l4,0l0,-19" />
              </svg>
              .
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost">&#9432;</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 text-center">
                <p>
                  The average{' '}
                  <svg
                    viewBox="0 -2 20 55"
                    className="inline-block h-6 w-2 -translate-y-1 fill-current"
                  >
                    <circle cx="9" cy="9" r="4" />
                    <path d="M9,32l0,19l4,0l0,-30l1,0l0,13l3,0l0,-18l-18,0l0,18l3,0l0,-13l1,0l-0,30l4,0l0,-19" />
                  </svg>{' '}
                  has a <b>total</b>* CO<sub>2</sub>e footprint of 6000t per
                  year.
                </p>
                <p>
                  <small>
                    * Not only this contributor, but all CO<sub>2</sub>e
                    combined of one person in one year.
                  </small>
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}

function calculateAngles(factorOfPersonYearFootprint: number) {
  const angle = (factorOfPersonYearFootprint % 1) * 360
  const isLeft = angle > 180
  const angleMask = isLeft ? angle - 180 : angle
  return { isLeft, angleMask }
}

function PieChart({ state }: { state: 'partial' | 'full' }) {
  return (
    <div className="-mx-36 text-primary">
      <svg className="w-full" viewBox="0 0 300 200">
        <circle
          cx="150"
          cy="100"
          r="75"
          strokeWidth={3}
          className="fill-secondary stroke-secondary drop-shadow-xl"
        />
        <circle
          cx="150"
          cy="100"
          r="74"
          mask={state === 'partial' ? 'url(#segmentMask)' : ''}
          className="fill-primary"
        />
        <g
          transform="translate(135,50) scale(1.8)"
          className="stroke-linejoin-round fill-white stroke-gray-800 stroke-1"
        >
          <circle cx="9" cy="9" r="4" />
          <path d="M9,32l0,19l4,0l0,-30l1,0l0,13l3,0l0,-18l-18,0l0,18l3,0l0,-13l1,0l-0,30l4,0l0,-19" />
        </g>
      </svg>
    </div>
  )
}

function generatePieParts(factorOfPersonYearFootprint: number) {
  const parts: Array<'full' | 'partial'> = Array.from(
    Array(Math.floor(factorOfPersonYearFootprint)),
    (_) => 'full' as const
  )
  if (
    Math.floor(factorOfPersonYearFootprint) - factorOfPersonYearFootprint !==
      0 ||
    factorOfPersonYearFootprint === 0
  ) {
    parts.push('partial')
  }

  return parts
}
