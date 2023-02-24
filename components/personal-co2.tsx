'use client'

import { Co2Average, Unit } from '@/domain/co2'
import { useState } from 'react'

export default function PersonalCo2({
  co2Average,
}: {
  co2Average: Co2Average
}) {
  const [consumption, setConsumption] = useState(
    co2Average.single_consumption_average
  )
  const [times, setTimes] = useState(co2Average.times_per_year_average)
  const co2PerConsumption = co2Average.avg_per_unit * consumption
  const co2PerYear = times * co2PerConsumption
  const factorOfPersonYearFootprint = co2PerYear / 6000000
  const angle = (factorOfPersonYearFootprint % 1) * 360
  const isLeft = angle > 180
  const angleMask = isLeft ? angle - 180 : angle

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

  console.log('render', factorOfPersonYearFootprint, parts)

  return (
    <div className="rounded-lg border border-sky-600 bg-sky-50 p-8">
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
                <b>{+parseFloat((co2PerConsumption / 1000).toFixed(1))}</b>
                &nbsp;kg
              </p>
            </div>
            <div className="flex items-baseline justify-between">
              <p>
                CO
                <sub>2</sub>e per year
              </p>
              <p className="text-2xl">
                <b>{+parseFloat((co2PerYear / 1000).toFixed(1))}</b>&nbsp;kg
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
            <input
              id="amountInput"
              type="range"
              className="range touch-pan-x text-sky-600"
              min={co2Average.single_consumption_from}
              max={co2Average.single_consumption_to}
              step={
                (co2Average.single_consumption_to -
                  co2Average.single_consumption_from) /
                50
              }
              value={consumption}
              onChange={(e) => setConsumption(Number(e.target.value))}
            />
            <label htmlFor="timesPerYearInput" className="mt-2 block">
              <div className="flex justify-between">
                <div>Times per year</div>
                <div>
                  ×&nbsp;<b>{Math.round(times)}</b>
                </div>
              </div>
            </label>
            <input
              id="timesPerYearInput"
              type="range"
              className="range touch-pan-x text-sky-600"
              min={co2Average.times_per_year_from}
              max={co2Average.times_per_year_to}
              step={
                (co2Average.times_per_year_to -
                  co2Average.times_per_year_from) /
                50
              }
              value={times}
              // onInput={(e) => setTimes(e)}
              onChange={(e) => setTimes(Number(e.target.value))}
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
            {parts.map((state) => (
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
                className="inline-block h-6 w-2 -translate-y-1"
              >
                <circle cx="9" cy="9" r="4" />
                <path d="M9,32l0,19l4,0l0,-30l1,0l0,13l3,0l0,-18l-18,0l0,18l3,0l0,-13l1,0l-0,30l4,0l0,-19" />
              </svg>
              .
            </span>
            <span
              role="button"
              aria-label="More information"
              className="rounded text-sky-600 hover:bg-sky-100"
            >
              &#9432;
            </span>
            <div className="tooltip text-sky-600">
              <p>
                The average{' '}
                <svg
                  viewBox="0 -2 20 55"
                  className="inline-block h-6 w-2 -translate-y-1"
                >
                  <circle cx="9" cy="9" r="4" />
                  <path d="M9,32l0,19l4,0l0,-30l1,0l0,13l3,0l0,-18l-18,0l0,18l3,0l0,-13l1,0l-0,30l4,0l0,-19" />
                </svg>{' '}
                has a <b>total</b>* CO<sub>2</sub>e footprint of 6000t per year.
              </p>
              <p>
                <small>
                  * Not only this contributor, but all CO<sub>2</sub>e combined
                  of one person in one year.
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PieChart({ state }: { state: 'partial' | 'full' }) {
  return (
    <div className="-mx-36 text-sky-600">
      <svg className="w-full" viewBox="0 0 300 200">
        <circle
          cx="150"
          cy="100"
          r="75"
          fill="lightgrey"
          className="drop-shadow-xl"
        />
        <circle
          cx="150"
          cy="100"
          r="75"
          fill="currentColor"
          mask={state === 'partial' ? 'url(#segmentMask)' : ''}
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
