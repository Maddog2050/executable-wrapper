# executable-wrapper

This GitHub action wraps executables and returns the stdout, stderr and exit code so that you can use the output in later steps.

## Usage

See [action.yml](action.yml).

### Example
```yaml
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: terraform-linters/setup-tflint@v1
        with:
          tflint_version: latest
          github_token: ${{ secrets.GITHUB_TOKEN }}
      - uses: maddog2050/executable-wrapper@v1
        id: tflint
        with:
          run_command: tflint --version
        continue-on-error: true
      - uses: actions/github-script@v5
        if: github.event_name == 'pull_request'
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            await github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: steps.tflint.outputs.stdout
            })
            
      - if: steps.tflint.outputs.exitcode != '0'
        run: exit 1
```

## License

The scripts and documentation in this project are released under the [MIT license](LICENSE).
