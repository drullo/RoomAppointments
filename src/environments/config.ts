export const config = {
  utilityApiUrl: 'http://utilityapi',
  emailConfig: {
    sender: {
      displayName: 'Conference Room Availability App'
    }
  },
  sharePoint: {
    serverUrl: 'https://sharepoint.cleavelandprice.com',
    employeePhotoSite: 'DigitalDisplay',
    employeePhotoList: 'Employee Thumbnail Photos',
    username: 'viewer',
    password: 'viewer',
  },
  logging: {
    source: 'Conference Rooms',
    authors: 'Dan Rullo',
    appType: 'Web'
  },
  appName: require('../../package.json').name,
  version: require('../../package.json').version
};