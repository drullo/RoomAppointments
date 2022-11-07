export const environment = {
  production: true,
  aDPeopleGroup: 'Conference Room People',
  roomAppointmentsRefreshMs: 1000 * 60 * 10, // 10 minutes
  peopleAppointmentsRefreshMs: 1000 * 60 * 10, // 10 minutes
  doorStatusRefreshMs: 1000 * 20, // 20 seconds
  inOutStatusRefreshMs: 1000 * 60 * 10, // 10 minutes
  photoRefreshMs: 1000 * 60 * 60 * 24, // 24 hours
  dayChangeRefreshMs: 1000 * 60 * 60, // 1 hour
  logging: {
    minLevel: 'warning',
    seqUrl: 'http://cpsp5:5341'
  }
};