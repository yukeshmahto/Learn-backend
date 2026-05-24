class ApiResponse {
    constructor(statusCode, message, data = "Success") {
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode
    }
}