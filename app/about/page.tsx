import { Cloud, Globe2, Leaf, PersonStanding, Sun, Trees } from 'lucide-react'

const About = () => {
  return (
    <main className="flex flex-wrap items-start justify-between gap-x-32 gap-y-8 py-6 md:py-10">
      <article className="grow basis-[32rem] space-y-6">
        <section>
          <h1 className="font-extrabold text-4xl">
            About CO<sub>2</sub> Data
          </h1>
          <blockquote className="my-4 border-l-4 bg-card px-4 py-3 text-border text-lg italic [text-wrap:balance] dark:text-white/70">
            What are the CO2 emissions of things?
          </blockquote>
          <p>
            How can we as a society fight the climate crisis if we hardly know
            the opponent (CO2). With the CO2 database I want to show the
            different CO2 emitters and their emissions. Everyone should be able
            to know and understand what causes how much CO2.
          </p>
        </section>
        <section>
          <h2 className="font-bold text-2xl">Contribution</h2>
          <p>
            I would love for you to contribute to the CO2 database. Either by
            contributing of emitters or by improving the database. You can find
            the project on{' '}
            <a
              href="https://github.com/co2data/co2data-org"
              className="text-muted-foreground"
              target="_blank"
              rel="noreferrer"
            >
              Github
            </a>
            .
          </p>
        </section>
        <section>
          <h2 className="font-bold text-2xl">About me</h2>
          <p>
            My name is Philip Schönholzer. Get in touch on{' '}
            <a
              href="https://mastodon.world/@phisch"
              className="text-muted-foreground"
              target="_blank"
              rel="noreferrer"
            >
              Mastadon
            </a>{' '}
            or{' '}
            <a
              href="https://www.reddit.com/user/phischer_h"
              className="text-muted-foreground"
              target="_blank"
              rel="noreferrer"
            >
              Reddit
            </a>
          </p>
        </section>
      </article>
      <aside className="flex grow basis-80 flex-wrap items-start justify-between gap-8 rounded-xl bg-card p-12 text-border">
        <Sun size={48} />
        <Cloud size={48} />
        <Globe2 size={48} />
        <Trees size={48} />
        <Leaf size={48} />
        <PersonStanding size={48} />
      </aside>
    </main>
  )
}

export default About
