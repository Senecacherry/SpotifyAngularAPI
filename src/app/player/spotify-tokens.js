const BaseURL = "https://accounts.spotify.com/";
const Endpoint = "authorize?client_id=7564ded58d2d41d98b580eec03b6c426&response_type=code&redirect_uri=https%3A%2F%2Flocalhost%3A44331%2FAccount%2FCallback&scope=user-read-private%20user-read-email&state=34fFs29kd09";
const EndpointAT = "authorize?client_id=7564ded58d2d41d98b580eec03b6c426&redirect_uri=https%3A%2F%2Flocalhost%3A44331%2FAccount%2FCallback&scope=user-read-private%20user-read-email&response_type=token&state=123";
if (!window.code) {
    window.location.href = BaseURL + Endpoint;
}
window.GetToken = function() {
    return $.ajax({
        url: "https://accounts.spotify.com/api/token",
        method: "POST",
        data: {
            client_id: "7564ded58d2d41d98b580eec03b6c426",
            client_secret: "4c58ba03c83b4cf68aad4f525db1f1f3",
            grant_type: "authorization_code",
            code: window.code,
            redirect_uri: "https://localhost:44331/Account/Callback"
        }
    });
};
window.GetRefreshToken = function() {
    return $.ajax({
        url: "https://accounts.spotify.com/api/token",
        method: "POST",
        data: {
            client_id: "7564ded58d2d41d98b580eec03b6c426",
            client_secret: "4c58ba03c83b4cf68aad4f525db1f1f3",
            grant_type: "refresh_token",
            refresh_token: window.refresh_token
        }
    });
};