let passed = 0
let failed = 0
const failures = []

export function assertEqual(actual, expected, msg) {
  if (actual === expected) {
    passed++
    console.log(`  ✓ ${msg}`)
  } else {
    failed++
    const detail = `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    failures.push({ msg, detail })
    console.error(`  ✗ ${msg}\n    ${detail}`)
  }
}

export function assert(condition, msg) {
  if (condition) {
    passed++
    console.log(`  ✓ ${msg}`)
  } else {
    failed++
    failures.push({ msg, detail: "Assertion failed" })
    console.error(`  ✗ ${msg}`)
  }
}

export function assertContains(text, substring, msg) {
  const lower = (text || "").toLowerCase()
  const sub = substring.toLowerCase()
  if (lower.includes(sub)) {
    passed++
    console.log(`  ✓ ${msg}`)
  } else {
    failed++
    const detail = `"${substring}" not found in response`
    failures.push({ msg, detail })
    console.error(`  ✗ ${msg}\n    ${detail}`)
  }
}

export function summary(name) {
  console.log(`\n${name}: ${passed} passed, ${failed} failed`)
  if (failures.length > 0) {
    console.error("\nFailures:")
    for (const f of failures) {
      console.error(`  - ${f.msg}: ${f.detail}`)
    }
    process.exit(1)
  }
}
