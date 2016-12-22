"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
/**
 * Module dependencies.
 */
const http_1 = require("http");
const init_1 = require("./init");
const server_1 = require("./server");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Save your local vars in .env for testing. DO NOT VERSION CONTROL `.env`!.
        // if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") require("dotenv").config();
        yield init_1.initAll();
        /**
         * Get port from environment and store in Express.
         */
        const app = server_1.default();
        const port = process.env.PORT || "9999";
        const server = http_1.createServer(app.callback());
        /**
         * Listen on provided port, on all network interfaces.
         */
        server.listen(port);
        server.on("listening", () => {
            const addr = server.address();
            console.info(`Listening on port ${addr.port}`);
        });
        server.on("error", (error) => {
            if (error.syscall !== "listen") {
                throw error;
            }
            const bind = `Port ${port}`;
            // handle specific listen errors with friendly messages
            switch (error.code) {
                case "EACCES":
                    console.error(`${bind} requires elevated privileges`);
                    process.exit(1);
                    break;
                case "EADDRINUSE":
                    console.error(`${bind} is already in use`);
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = main;
main();

//# sourceMappingURL=index.js.map
