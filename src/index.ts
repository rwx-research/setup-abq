import * as core from '@actions/core'
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

function getInstallId() {
  const runId = process.env.GITHUB_RUN_ID
  const runAttempt = process.env.GITHUB_RUN_ATTEMPT || '1'

  return `${runId}-${runAttempt}`
}

async function run() {
  const accessToken = core.getInput('access-token')
  if (!accessToken || accessToken.trim().length === 0) {
    core.setFailed("`access-token` field can't be empty.")
  }

  const releaseChannel = core.getInput('release-channel') || 'v1'
  if (!['v1', 'unstable'].includes(releaseChannel)) {
    core.setFailed(
      `Invalid \`release-channel\` field: ${releaseChannel}. \`release-channel\` must be "v1".`
    )
  }
  const os = getOs()
  const arch = getArch()
  const installId = getInstallId()

  const downloadUrl = `https://abq.build/api/releases/${releaseChannel}?os=${os}&arch=${arch}&install_id=${installId}`
  core.debug(`fetching ${downloadUrl}`)
  const abqTar = await tc.downloadTool(
    downloadUrl,
    /* dest */ undefined,
    `Bearer ${accessToken}`
  )
  const abqFolder = await tc.extractTar(
    abqTar,
    /* dest */ undefined,
    /* flags */ ['-xv', '--strip-components=1']
  )

  core.addPath(abqFolder)
}

run().catch(err => core.setFailed(err))
