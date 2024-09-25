const username = "user";
const password = "12345";
const basicAuth = `Basic ${btoa(`${username}:${password}`)}`;
export default basicAuth