import { configureAllowedScripts } from '@ministryofjustice/hmpps-npm-script-allowlist'

export default configureAllowedScripts({
   allowlist: {
     "node_modules/cypress@13.17.0": "ALLOW",
     "node_modules/dtrace-provider@0.8.8": "ALLOW",
     "node_modules/esbuild@0.25.8": "ALLOW",
     "node_modules/fsevents@2.3.3": "ALLOW",
     "node_modules/postinstall-postinstall@2.1.0": "ALLOW",
     "node_modules/protobufjs@7.5.4": "ALLOW"
   },
})
