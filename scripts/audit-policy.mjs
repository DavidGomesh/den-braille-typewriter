export function evaluateAudit(report, baseline) {
    const current = report.metadata.vulnerabilities
    const regressions = ['critical', 'high'].filter(
        severity => current[severity] > baseline[severity]
    )

    const allowedOccurrences = new Set(
        baseline.allowedCriticalAndHighOccurrences
    )
    const currentOccurrences = new Set()

    for (const [dependency, vulnerability] of Object.entries(report.vulnerabilities)) {
        for (const advisory of vulnerability.via) {
            if (
                typeof advisory === 'object' &&
                ['critical', 'high'].includes(advisory.severity)
            ) {
                const advisoryId = advisory.url.split('/').at(-1)
                currentOccurrences.add(`${advisoryId}:${dependency}`)
            }
        }
    }

    const newOccurrences = [...currentOccurrences]
        .filter(occurrence => !allowedOccurrences.has(occurrence))
        .sort()
    const resolvedOccurrences = [...allowedOccurrences]
        .filter(occurrence => !currentOccurrences.has(occurrence))
        .sort()

    return { regressions, newOccurrences, resolvedOccurrences }
}
