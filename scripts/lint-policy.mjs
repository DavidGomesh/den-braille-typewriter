import { relative, sep } from 'node:path'

function fingerprint(filePath, message, rootDirectory) {
    const projectPath = relative(rootDirectory, filePath).split(sep).join('/')
    return `${projectPath}:${message.ruleId ?? 'parse-error'}:${message.message}`
}

export function evaluateLint(report, baseline, rootDirectory) {
    const currentFailures = report
        .flatMap(result => result.messages.map(message =>
            fingerprint(result.filePath, message, rootDirectory)
        ))
        .sort()
    const count = failures => failures.reduce((counts, failure) => {
        counts.set(failure, (counts.get(failure) ?? 0) + 1)
        return counts
    }, new Map())
    const currentCounts = count(currentFailures)
    const inheritedCounts = count(baseline)
    const difference = (failures, allowedCounts) => {
        const seen = new Map()
        return failures.filter(failure => {
            const occurrence = (seen.get(failure) ?? 0) + 1
            seen.set(failure, occurrence)
            return occurrence > (allowedCounts.get(failure) ?? 0)
        })
    }

    return {
        newFailures: difference(currentFailures, inheritedCounts),
        resolvedFailures: difference([...baseline].sort(), currentCounts),
    }
}
