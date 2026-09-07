export function publicBasePathFromHomepage(homepage) {
    return new URL(homepage).pathname.replace(/\/$/, '')
}
