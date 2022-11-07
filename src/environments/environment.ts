// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  aDPeopleGroup: 'Conference Room People',
  roomAppointmentsRefreshMs: 1000 * 60 * 10, // 10 minutes
  peopleAppointmentsRefreshMs: 1000 * 60 * 10, // 10 minutes
  doorStatusRefreshMs: 1000 * 20, // 20 seconds
  inOutStatusRefreshMs: 1000 * 60 * 10, // 10 minutes
  photoRefreshMs: 1000 * 60 * 60 * 24, // 24 hours
  dayChangeRefreshMs: 1000 * 60 * 60, // 1 hour
  logging: {
    minLevel: 'verbose',
    seqUrl: 'http://localhost:8981'
  }
};