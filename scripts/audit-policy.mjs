export function evaluateAudit(report, baseline) {
    const current = report.metadata.vulnerabilities
    const regressions = ['critical', 'high'].filter(
        severity => current[severity] > baseline[severity]
    )

    const allowedAdvisories = new Set(
        baseline.allowedCriticalAndHighAdvisories
    )
    const currentAdvisories = new Set()

    for (const vulnerability of Object.values(report.vulnerabilities)) {
        for (const advisory of vulnerability.via) {
            if (
                typeof advisory === 'object' &&
                ['critical', 'high'].includes(advisory.severity)
            ) {
                currentAdvisories.add(advisory.url.split('/').at(-1))
            }
        }
    }

    const newAdvisories = [...currentAdvisories]
        .filter(advisoryId => !allowedAdvisories.has(advisoryId))
        .sort()

    return { regressions, newAdvisories }
}
