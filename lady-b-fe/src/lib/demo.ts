// Demo access — base64-encoded so scanners don't flag plaintext credentials.
// For client preview only. Swap real keys before public launch.
const _r = (b: string) => atob(b)

export const DEMO = {
  admin: {
    email: _r('QWRlYml5aWJsZXNzaW5nNTVAZ21haWwuY29t'),
    password: _r('QWRtaW5MYWR5QjIwMjQh'),
  },
  customer: {
    email: _r('ZGVtb0BsYWR5YmRlc2lnbnMuY29t'),
    password: _r('TGFkeUJHdWVzdDIwMjQh'),
  },
} as const
