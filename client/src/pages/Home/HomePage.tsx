function HomePage() {
  return (
    <>
      <section className="relative max-w-7xl mx-auto px-6 pt-40 text-center text-white">
        <h2 className="text-gray-200 mb-6 text-xl sm:text-2xl leading-relaxed">
          Track films you’ve watched.
          <br />
          Save those you want to see.
          <br />
          Tell your friends what’s good.
        </h2>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-lg mb-4">
          Get Started
        </button>
        <p className="text-gray-400">
          The social network for film lovers. Also available on
        </p>
      </section>

      <section className="relative z-10 py-10 px-6 max-w-7xl mx-auto">
        <div className="">
          <h1>Popular this month</h1>
          <div className="flex gap-4 flex-wrap justify-center"></div>
        </div>
      </section>

      <section className="relative max-w-7xl">
        <p>Shottrace lets you...</p>
      </section>

      <section className="relative max-w-7xl">
        <p>Just Reviewed…</p>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <section className="relative max-w-7xl">
          <p>Popular reviews this week</p>
        </section>

        <div>
          <section className="relative max-w-7xl">
            <p>Popular Reviewers</p>
          </section>
          <section className="relative max-w-7xl">
            <p>Popular lists</p>
          </section>
        </div>
      </div>
    </>
  );
}

export default HomePage;
