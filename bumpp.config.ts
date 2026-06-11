import { defineConfig } from 'bumpp'

export default defineConfig({
  execute: 'pnpm changelog:write',
  commit: 'chore(release): v%s',
  tag: 'v%s',
  push: true,
  sign: false,
  all: true,
  noVerify: false,
})
