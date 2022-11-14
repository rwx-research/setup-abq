import * as core from '@actions/core'
import * as http from '@actions/http-client'
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

async function run() {
  const accessToken = core.getInput('access-token') || core.getInput('abq-token')
  const version = 'v1'
  const os = getOs()
  const arch = getArch()

  const downloadUrl = `https://abq.build/api/releases/${version}/abq_${version}_${os}_${arch}.tar.gz`
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
