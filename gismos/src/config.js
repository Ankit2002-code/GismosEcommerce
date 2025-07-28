const frontEndPrefix = ""

// Use environment variable for backend URL, fallback to localhost for development
const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

export default {
    getBackendUrl: (suffix) => {return backendUrl + suffix},
    localTokenKey: "token-mgr28ocn3gcr87",

    sessionIdKey: "id-biufniwehmf83298m",
    sessionEmailKey: "email-ndm983mh2iur30",
    sessionNameKey: "name-ncjkhm8728r29uf",

    prefix: "",
    homePage: `${frontEndPrefix}/`,
    loginPage: `${frontEndPrefix}/login`,
    profilePage: `${frontEndPrefix}/profile`,
    productPage: `${frontEndPrefix}/product`,
    confirmPage: `${frontEndPrefix}/confirm`,
    ordersPage: `${frontEndPrefix}/orders`,
}