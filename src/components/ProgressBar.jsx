export function ProgressBar({completed, total}) {
    const percent = total > 0 ? Math.min((completed / total) * 100, 100) : 0;

    return (
        <div className="progress-wrapper">
            <div className="progress-track">
                <div className="progress-fill" style={{width: `${percent}%`}} />
            </div>
            <p className="progress-label">{completed}/{total} credit hours</p>
        </div>
    );
}