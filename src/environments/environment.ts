/**
 * Source : https://angular.io/guide/build
*/
export const environment = {
	production: false,
  apiUrl: import.meta.env['NG_API_BASE_URL'] || 'http://localhost:8080/api/delivery_system',
};
