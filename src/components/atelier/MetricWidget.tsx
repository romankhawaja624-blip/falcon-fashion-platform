interface MetricWidgetProps {
  label: string;
  value: string;
  detail: string;
  tone?: 'default' | 'blue';
}

export function MetricWidget({ label, value, detail, tone = 'default' }: MetricWidgetProps) {
  return (
    <article className={`metric-widget metric-widget--${tone}`}>
      <div className="metric-widget__header">
        <p className="eyebrow">{label}</p>
        <span className="metric-widget__indicator" aria-hidden="true" />
      </div>
      <div className="metric-widget__body">
        <strong className="metric-widget__value">{value}</strong>
      </div>
      <div className="metric-widget__footer">
        <span className="metric-widget__detail">{detail}</span>
      </div>
    </article>
  );
}