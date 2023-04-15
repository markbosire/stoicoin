"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_URL = "http://localhost:3001";
const registerButton = document.getElementById("register-button");
const nodeUrlInput = document.getElementById("node-url");
const broadcastButton = document.getElementById("broadcast-button");
const broadcastMessageInput = document.getElementById("broadcast-message");
let registeredNodes = [];
registerButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const newNodeUrl = nodeUrlInput.value.trim();
    let error;
    if (!newNodeUrl) {
        return alert("Please enter a valid node URL");
    }
    try {
        const response = yield fetch(`${API_URL}/register-and-broadcast-node`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                newNodeUrl,
            }),
        });
        if (!response.ok) {
            throw new Error("Failed to register node.");
        }
        alert("Node registered successfully");
    }
    catch (error) {
        alert(error.message);
    }
}));
