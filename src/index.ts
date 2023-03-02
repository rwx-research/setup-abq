import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'

function getOs() {
  switch (process.platform) {
    default: {
      return process.platform
    }
  }
}

function getArch() {
  switch (process.arch) {
    case 'x64': {
      return 'x86-64'
    }
    default: {
      return process.arch
    }
  }
}

function getInstallId(releaseChannel: string) {
  const runId = process.env.GITHUB_RUN_ID
  const runAttempt = process.env.GITHUB_RUN_ATTEMPT || '1'

  return `${runId}-${runAttempt}-${releaseChannel}`
}

async function run() {
  const accessToken = core.getInput('access-token')
  if (!accessToken || accessToken.trim().length === 0) {
    core.setFailed("`access-token` field can't be empty.")
  }

  const releaseChannel = core.getInput('release-channel') || 'v1'
  if (typeof releaseChannel !== 'string') {
    core.setFailed(
      `Invalid \`release-channel\` field: ${releaseChannel}. Did you mean to specify "v1"?`
    )
  }
  const os = getOs()
  const arch = getArch()
  const installId = getInstallId(releaseChannel)

  const url = `https://abq.build/api/releases/${releaseChannel}/${os}/${arch}/abq?install_id=${installId}`

  core.debug(`Fetching ${url}`)
  const abq = await tc.downloadTool(
    url,
    /* dest */ undefined,
    `Bearer ${accessToken}`
  )

  const destination = '/usr/local/bin/abq'
  core.debug(`Installing to ${destination}`)
  await exec.exec('install', [abq, destination])

  const {stdout} = await exec.getExecOutput('abq', ['--version'], {
    silent: true
  })
  const cliVersion = stdout.replace('\n', '')

  core.info(`abq ${cliVersion} is installed`)
}

run().catch(err => core.setFailed(err))
