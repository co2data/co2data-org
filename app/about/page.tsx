const About = () => {
  return (
    <main className="space-y-4">
      <h1 className="text-4xl font-bold">About CO2 Database</h1>
      <p>What are the CO2 emissions of things.</p>

      <p>
        How can we as a society fight the climate crisis if we hardly know the
        opponent (CO2). With the CO2 database I want to show the different CO2
        emitters and their emissions. Everyone should be able to know and
        understand what causes how much CO2.
      </p>

      <h2 className="!mt-14 text-2xl font-bold">Contribution</h2>
      <p>
        I would love for you to contribute to the CO2 database. Either by
        contributing of emitters or by improving the database. You can find the
        project on{' '}
        <a
          href="https://github.com/co2data/co2data-org"
          className="text-sky-700"
          target="_blank"
          rel="noreferrer"
        >
          Github
        </a>
        .
      </p>

      <h2 className="!mt-14 text-2xl font-bold">About me</h2>
      <p>
        My name is Philip Schönholzer. Get in touch on{' '}
        <a
          href="https://mastodon.world/@phisch"
          className="text-sky-700"
          target="_blank"
          rel="noreferrer"
        >
          Mastadon
        </a>{' '}
        or{' '}
        <a
          href="https://www.reddit.com/user/phischer_h"
          className="text-sky-700"
          target="_blank"
          rel="noreferrer"
        >
          Reddit
        </a>
      </p>
    </main>
  )
}

export default About
