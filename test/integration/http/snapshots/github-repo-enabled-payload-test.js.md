# Snapshot report for `test/integration/http/github-repo-enabled-payload-test.js`

The actual snapshot is saved in `github-repo-enabled-payload-test.js.snap`.

Generated by [AVA](https://ava.li).

## payload test "enabled" - should handle valid github repo enabled payload

> Snapshot 1

    {
      body: {
        enabled: true,
      },
      status: 200,
    }

## payload test "non-existent-repo-disabled" - should return enabled false when a repo does not exist

> Snapshot 1

    {
      body: {
        enabled: false,
      },
      status: 200,
    }
