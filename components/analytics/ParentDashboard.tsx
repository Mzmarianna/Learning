const defaultMetrics = {
  activeLearners: 42,
  mentorshipNotes: 128,
  weeklyGrowthPercent: 12,
  regulationMoments: 67
};

type ParentDashboardProps = Partial<typeof defaultMetrics>;

const ParentDashboard = (props: ParentDashboardProps = {}): JSX.Element => {
  const mergedMetrics = { ...defaultMetrics, ...props };

  return (
    <section className="parent-dashboard">
      <header>
        <h2>Parent and guardian dashboard</h2>
        <p>Give families a concise view of progress, regulation wins, and next actions.</p>
      </header>

      <div className="parent-dashboard__grid">
        <article>
          <h3>Active learners</h3>
          <p className="parent-dashboard__value">{mergedMetrics.activeLearners}</p>
          <p className="parent-dashboard__hint">Learners engaged in the past 7 days.</p>
        </article>
        <article>
          <h3>Mentor reflections</h3>
          <p className="parent-dashboard__value">{mergedMetrics.mentorshipNotes}</p>
          <p className="parent-dashboard__hint">Personalized notes ready for family review.</p>
        </article>
        <article>
          <h3>Weekly growth</h3>
          <p className="parent-dashboard__value">{mergedMetrics.weeklyGrowthPercent}%</p>
          <p className="parent-dashboard__hint">Aggregate skill streak increase.</p>
        </article>
        <article>
          <h3>Regulation wins</h3>
          <p className="parent-dashboard__value">{mergedMetrics.regulationMoments}</p>
          <p className="parent-dashboard__hint">Moments logged where co-regulation tools helped.</p>
        </article>
      </div>
    </section>
  );
};

export default ParentDashboard;
