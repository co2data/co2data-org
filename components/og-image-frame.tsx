export default function OgImageFrame({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '4em 9em 5em',
        color: 'white',
        background: '#3982C2',
      }}
    >
      <div tw="flex flex-col grow">
        <div tw="flex grow justify-between">
          <div tw="flex flex-col text-center justify-center items-center rounded-lg min-w-20 min-h-20 self-start p-3 text-xl leading-4 font-bold bg-white text-sky-600">
            CO₂
            <br />
            Data
          </div>
          <div tw="text-4xl">co2data.org</div>
        </div>
        {children}
      </div>
    </div>
  )
}
